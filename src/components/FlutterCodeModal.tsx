import React, { useState } from 'react';
import { getFlutterCodeSnippet } from '../utils/flutterCodeGenerator';
import { LifeStage, SubTab } from '../types';
import { X, Copy, Check, Code, Smartphone, Layers } from 'lucide-react';

interface FlutterCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStage: LifeStage;
  activeSubTab: SubTab;
}

export const FlutterCodeModal: React.FC<FlutterCodeModalProps> = ({
  isOpen,
  onClose,
  activeStage,
  activeSubTab,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const snippet = getFlutterCodeSnippet(activeStage, activeSubTab);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FCFAF7] text-[#3D251E] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-[#F0E8DD] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#FFF5ED] border-b border-[#F4D9CC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#8B3012] text-white shadow-xs">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#5E2211] font-serif flex items-center gap-2">
                Flutter Dart Source Exporter
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C85A32] text-white font-mono font-bold">
                  {snippet.fileName}
                </span>
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                Ready-to-use Flutter widgets & layout implementation matching current view
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-white rounded-xl border border-[#EAE0D2] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4 font-mono text-sm">
          {/* Quick Info bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans text-xs">
            <div className="bg-white p-3.5 rounded-2xl border border-[#EAE0D2] shadow-xs flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-[#C85A32]" />
              <div>
                <p className="text-stone-500 font-medium">Target Framework</p>
                <p className="font-bold text-[#5E2211]">Flutter 3.x+ Mobile & Web</p>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-[#EAE0D2] shadow-xs flex items-center gap-3">
              <Layers className="w-4 h-4 text-[#8B3012]" />
              <div>
                <p className="text-stone-500 font-medium">State Management</p>
                <p className="font-bold text-[#5E2211]">StatefulWidget / Provider / Bloc</p>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-[#EAE0D2] shadow-xs flex items-center gap-3">
              <Code className="w-4 h-4 text-emerald-700" />
              <div>
                <p className="text-stone-500 font-medium">Theme Palette</p>
                <p className="font-bold text-[#5E2211]">Mathreya Terracotta & Cream</p>
              </div>
            </div>
          </div>

          {/* Code Viewer Container */}
          <div className="relative rounded-2xl border border-[#EAE0D2] bg-stone-900 text-stone-100 overflow-hidden shadow-inner">
            <div className="px-4 py-2.5 bg-stone-950 border-b border-stone-800 flex justify-between items-center text-xs text-stone-400 font-sans">
              <span className="font-bold text-amber-200">{snippet.fileName}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C85A32] hover:bg-[#B34D29] text-white font-bold transition shadow-xs cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Flutter Dart Code'}
              </button>
            </div>
            <pre className="p-4 text-stone-200 overflow-x-auto text-xs leading-relaxed max-h-[50vh]">
              <code>{snippet.code}</code>
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#FAF6F0] border-t border-[#EAE0D2] flex justify-between items-center">
          <p className="text-xs text-stone-600 font-medium">
            Paste directly into your Flutter <code className="text-[#8B3012] font-bold">lib/screens/</code> folder.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-stone-50 text-[#5E2211] border border-[#EAE0D2] text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
          >
            Close Exporter
          </button>
        </div>
      </div>
    </div>
  );
};
