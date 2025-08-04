import express from 'express';
import cors from 'cors';
import { execa } from 'execa';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { readFileSync } from 'fs';
import crypto from 'crypto';

import admin from 'firebase-admin';
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json'));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const auth = admin.auth();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: frontendUrl }));
app.use(express.json({ limit: '10kb' }));

const mediaDir = path.join(__dirname, 'media');
app.use(express.static(mediaDir));

// --- Authentication Middleware ---
const checkAuth = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
        return res.status(401).send('Unauthorized: No token provided.');
    }
    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).send('Unauthorized: Invalid token.');
    }
};

app.get('/', (req, res) => {
  res.send('Hello from the Manim Backend Server!');
});

// --- PROTECTED Render Route ---
app.post('/render', checkAuth, async (req, res) => {
    const { code, prompt } = req.body;
    const userId = req.user.uid;

    if (!code || !prompt) {
        return res.status(400).json({ error: 'Code and prompt must be provided.' });
    }

    const uniqueId = crypto.randomBytes(8).toString('hex');
    const sceneFileName = `temp_scene_${uniqueId}.py`;
    const sceneFilePath = path.join(__dirname, sceneFileName);
    
    const outputVideoName = 'GeneratedAnimationScene.mp4';
    
    try {
        await fs.writeFile(sceneFilePath, code);
        await execa('manim', [sceneFilePath, 'GeneratedAnimationScene', '-ql']);
        
        const videoUrl = `${process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`}/videos/${sceneFileName.replace('.py', '')}/480p15/${outputVideoName}`;

        const creationRecord = {
            prompt: prompt,
            code: code,
            videoUrl: videoUrl,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            userId: userId
        };
        await db.collection('creations').doc(userId).collection('userCreations').add(creationRecord);
        console.log(`Saved creation for user ${userId} to Firestore.`);

        res.json({ videoUrl });

    } catch (error) {
        console.error('Error rendering video:', error);
        res.status(500).json({ 
            error: 'Failed to render video.',
            message: error.message,
            stdout: error.stdout,
            stderr: error.stderr
        });
    } finally {
        try {
            await fs.unlink(sceneFilePath);
        } catch (cleanupError) {
            console.error('Error cleaning up temp file:', cleanupError);
        }
    }
});

// --- PROTECTED History Routes ---
app.get('/history', checkAuth, async (req, res) => {
    const userId = req.user.uid;
    try {
        const creationsRef = db.collection('creations').doc(userId).collection('userCreations');
        const snapshot = await creationsRef.orderBy('createdAt', 'desc').get();
        const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history.' });
    }
});

app.delete('/history/:id', checkAuth, async (req, res) => {
    const userId = req.user.uid;
    const { id } = req.params;
    try {
        await db.collection('creations').doc(userId).collection('userCreations').doc(id).delete();
        res.status(200).json({ message: 'Successfully deleted.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete history item.' });
    }
});

app.delete('/history', checkAuth, async (req, res) => {
    const userId = req.user.uid;
    try {
        const creationsRef = db.collection('creations').doc(userId).collection('userCreations');
        const snapshot = await creationsRef.get();
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        res.status(200).json({ message: 'Successfully cleared all history.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear history.' });
    }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});