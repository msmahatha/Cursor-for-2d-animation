import express from 'express';
import cors from 'cors';
import { execa } from 'execa';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises'; // For file system operations
import crypto from 'crypto'; // To generate unique filenames

// Since we are using ES Modules, __dirname is not available directly.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;

// --- Middleware ---
app.use(cors()); 
app.use(express.json({ limit: '10kb' })); // Set a reasonable payload size limit

// Statically serve the 'media' folder where Manim saves videos
const mediaDir = path.join(__dirname, 'media');
app.use(express.static(mediaDir));


// --- Test Route ---
app.get('/', (req, res) => {
  res.send('Hello from the Manim Backend Server!');
});

// --- Render Route ---
app.post('/render', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'No code provided.' });
    }

    // Generate a unique filename to avoid conflicts during concurrent requests
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const sceneFileName = `temp_scene_${uniqueId}.py`;
    const sceneFilePath = path.join(__dirname, sceneFileName);
    
    // Manim saves files in a nested directory structure based on the scene name and quality.
    // e.g., ./media/videos/temp_scene_.../480p15/GeneratedAnimationScene.mp4
    const outputDir = path.join(mediaDir, 'videos', sceneFileName.replace('.py', ''));
    const outputVideoName = 'GeneratedAnimationScene.mp4';
    const finalVideoPath = path.join(outputDir, '480p15', outputVideoName);

    try {
        // 1. Write the received code to a temporary python file
        await fs.writeFile(sceneFilePath, code);

        // 2. Run the manim command using execa.
        // We render with low quality ('-ql') for speed.
        // The class name 'GeneratedAnimationScene' must match the one in the generated code.
        console.log(`Running manim... Command: manim ${sceneFilePath} GeneratedAnimationScene -ql`);
        const { stdout, stderr } = await execa('manim', [sceneFilePath, 'GeneratedAnimationScene', '-ql']);
        
        console.log('Manim stdout:', stdout);
        if (stderr) {
            console.error('Manim stderr:', stderr);
        }

        // 3. Construct the URL to the video.
        // The URL path needs to match the static serving path and the file structure.
        const videoUrl = `http://localhost:${PORT}/videos/${sceneFileName.replace('.py', '')}/480p15/${outputVideoName}`;
        console.log(`Successfully rendered. Video URL: ${videoUrl}`);

        // 4. Send the URL back to the frontend
        res.json({ videoUrl });

    } catch (error) {
        console.error('Error rendering video:', error);
        // Send back detailed error information for debugging
        res.status(500).json({ 
            error: 'Failed to render video.',
            message: error.message,
            stdout: error.stdout,
            stderr: error.stderr
        });
    } finally {
        // 5. Clean up the temporary python file
        try {
            await fs.unlink(sceneFilePath);
        } catch (cleanupError) {
            console.error('Error cleaning up temp file:', cleanupError);
        }
    }
});


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
