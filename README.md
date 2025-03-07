# EZbay - AI-Powered eBay Listing Generator

EZbay is a modern web application that helps sellers create professional eBay listings using AI. It generates detailed, SEO-optimized descriptions for your items, taking into account their condition and specifications.

## Features

- 🤖 AI-powered listing generation
- 📝 Structured, professional descriptions
- 🏷️ SEO-optimized titles and keywords
- 📦 Condition-based content generation
- 🎨 Modern, responsive UI
- ⚡ Fast and efficient

## Tech Stack

### Frontend
- React with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Modern UI components

### Backend
- FastAPI (Python)
- Hyperbolic API for AI generation
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/EZbay.git
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
```

5. Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:8000
```

### Running the Application

1. Start the backend server:
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

2. Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

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