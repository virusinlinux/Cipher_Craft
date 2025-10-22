
import React, { useState, useCallback } from 'react';
import { EncryptionMethod, Mode } from './types';
import { encrypt, decrypt } from './services/cryptoService';
import { generateStory } from './services/geminiService';
import Header from './components/Header';
import OutputPanel from './components/OutputPanel';
import SparklesIcon from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('');
  const [encryptionMethod, setEncryptionMethod] = useState<EncryptionMethod>(EncryptionMethod.MORSE);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geminiPrompt, setGeminiPrompt] = useState('a hidden treasure map');

  const validateKey = useCallback(() => {
    if (!/^\d{4}$/.test(key)) {
      setError('Key must be exactly 4 digits.');
      return false;
    }
    setError(null);
    return true;
  }, [key]);

  const handleProcess = (mode: Mode) => {
    if (!validateKey()) return;
    
    setIsLoading(true);
    setOutput('');
    setError(null);

    // Simulate processing time for better UX
    setTimeout(() => {
      try {
        const result = mode === 'encrypt'
          ? encrypt(message, key, encryptionMethod)
          : decrypt(message, key, encryptionMethod);
        setOutput(result);
      } catch (e) {
        if (e instanceof Error) {
            setError(`Operation failed: ${e.message}. Check your input and key.`);
        } else {
            setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const handleGenerateAndEncrypt = async () => {
    if (!validateKey()) return;
    if (!geminiPrompt) {
        setError("Please enter a prompt for the story.");
        return;
    }

    setIsLoading(true);
    setOutput('');
    setError(null);
    
    try {
        const story = await generateStory(geminiPrompt);
        if(story.startsWith("Error from Gemini:") || story.startsWith("An unknown error occurred")){
            setError(story);
            setIsLoading(false);
            return;
        }
        setMessage(story);
        const encryptedStory = encrypt(story, key, encryptionMethod);
        setOutput(encryptedStory);
    } catch(e) {
        if (e instanceof Error) {
            setError(`Generation failed: ${e.message}`);
        } else {
            setError('An unknown error occurred during generation.');
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Control Panel */}
        <div className="flex flex-col gap-6">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Your Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter text to encrypt or decrypt..."
              className="w-full h-40 p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="key" className="block text-sm font-medium text-gray-400 mb-2">4-Digit Key</label>
              <input
                type="password"
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                placeholder="e.g., 1234"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="method" className="block text-sm font-medium text-gray-400 mb-2">Method</label>
              <select
                id="method"
                value={encryptionMethod}
                onChange={(e) => setEncryptionMethod(e.target.value as EncryptionMethod)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
              >
                <option value={EncryptionMethod.MORSE}>Morse Code Cipher</option>
                <option value={EncryptionMethod.CAESAR}>Caesar Cipher</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => handleProcess('encrypt')} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
              Encrypt
            </button>
            <button onClick={() => handleProcess('decrypt')} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
              Decrypt
            </button>
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-yellow-400" />
              Gemini-Powered Story
            </h3>
            <p className="text-sm text-gray-500 mb-3">Generate a story and encrypt it instantly.</p>
            <div className="flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    value={geminiPrompt}
                    onChange={(e) => setGeminiPrompt(e.target.value)}
                    placeholder="Enter a story prompt..."
                    className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                />
                <button 
                    onClick={handleGenerateAndEncrypt} 
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
                >
                    <SparklesIcon className="w-5 h-5"/>
                    Generate & Encrypt
                </button>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-400 mb-2">Result</label>
          <div className="flex-grow">
            <OutputPanel output={output} isLoading={isLoading} error={error} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
