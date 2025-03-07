# EZbay - AI-Powered eBay Listing Generator

EZbay is a modern web application that helps sellers create professional eBay listings using AI. It generates detailed, SEO-optimized descriptions for your items, taking into account their condition and specifications.

## Features

- 🤖 AI-powered listing generation
- 📝 Structured, professional descriptions
- 🏷️ SEO-optimized titles and keywords
- 📦 Condition-based content generation
- 🎨 Modern, responsive UI
- ⚡ Fast and efficient

For planned enhancements and future development, see our [Future Features Roadmap](FUTURE_FEATURES.md).

## Tech Stack

### Frontend
- React with TypeScript
- Vite for fast development
- Chakra UI for styling
- Modern UI components

### Backend
- FastAPI (Python)
- Hyperbolic API for AI generation
- RESTful API architecture

## Getting Started

### Option 1: Using Docker (Recommended)

#### Prerequisites
- Docker and Docker Compose

#### Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/CryptoSI/EZbay.git
cd EZbay
```

2. Create an `.env.docker` file in the root directory:
```
HYPERBOLIC_API_KEY=your_hyperbolic_api_key_here
```

3. Build and run the application:
```bash
docker-compose --env-file .env.docker up --build
```

The application will be available at `http://localhost:5173`. The backend API will be running at `http://localhost:8000`.

### Option 2: Manual Setup

#### Prerequisites
- Node.js (v16 or higher)
- Python 3.11 or higher (Python 3.13 may have compatibility issues with some dependencies)
- npm or yarn

#### Installation

1. Clone the repository:
```bash
git clone https://github.com/CryptoSI/EZbay.git
cd EZbay
```

2. Install frontend dependencies:
```bash
npm install
```

3. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory:
```
HYPERBOLIC_API_KEY=your_api_key_here
PORT=8000
HOST=0.0.0.0
ALLOWED_ORIGINS=http://localhost:5173,https://e-zbay-front.vercel.app
DEFAULT_MODEL=meta-llama/Meta-Llama-3.1-8B-Instruct
LARGE_MODEL=meta-llama/Llama-3.3-70B-Instruct
```

5. Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:8000
```

#### Running the Application Manually

1. Start the backend server:
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

2. Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Option 3: Deploying to Vercel

EZbay can be deployed to Vercel by separating the frontend and backend into two different Vercel projects. For detailed deployment instructions, see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md).

## Usage

1. Enter your item details including name and condition
2. Click "Generate Listing"
3. Review the generated listing
4. Copy and paste the content to your eBay listing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Hyperbolic API for AI capabilities
- eBay for the platform integration
- All contributors and users of the project

## Author

Built by [CryptoSI](https://github.com/CryptoSI)

## Common Issues and Troubleshooting

### Local Development
1. **Docker Network Issues**: If containers can't communicate, ensure Docker network is properly configured and all services are running (`docker-compose ps`).
2. **Environment Variables**: Double-check that all required environment variables are set in your `.env` file. Missing variables will cause startup failures.
3. **Port Conflicts**: If ports 8000 or 5173 are already in use, either stop the conflicting services or modify the port mappings in `docker-compose.yml`.
4. **Hot Reload Not Working**: In some cases, the development server might not detect changes. Try restarting the container with `docker-compose restart frontend`.

### API Integration
1. **CORS Errors**: If you see CORS-related errors in the console:
   - Verify that `ALLOWED_ORIGINS` includes your frontend URL
   - For local development, ensure it includes `http://localhost:5173`
   - Check that the backend is properly handling OPTIONS requests
2. **API Key Issues**: If the Hyperbolic API isn't responding:
   - Confirm your API key is valid and properly set in the environment
   - Check the backend logs for any authentication errors
   - Ensure you're not hitting rate limits

### Vercel Deployment
1. **Build Failures**: 
   - Ensure all dependencies are listed in `requirements.txt` (backend) and `package.json` (frontend)
   - Check that Node.js and Python versions are compatible with Vercel
2. **Runtime Errors**:
   - Verify all environment variables are set in Vercel project settings
   - For the frontend, ensure `VITE_API_URL` points to the correct backend URL
   - For the backend, confirm `ALLOWED_ORIGINS` includes the frontend's domain
3. **Timeout Issues**:
   - Consider upgrading your Vercel plan if you experience function timeouts
   - Optimize API calls to complete within serverless function limits

### Performance
1. **Slow Response Times**: 
   - The AI model generation can take 10-30 seconds depending on the request
   - Consider using the smaller model for faster responses
2. **Memory Usage**:
   - The application may use significant memory during image generation
   - Monitor container resources if running on limited hardware

For any other issues, please check the [Issues](https://github.com/yourusername/EZbay/issues) section of the repository or create a new issue. 