import React, { useState, useEffect } from 'react';
import { runAutomatedTests, TestCaseResult } from '../tests/rulesEngine.test';
import { CheckCircle2, XCircle, Play, X, ShieldCheck, RefreshCw } from 'lucide-react';

interface TestRunnerModalProps {
  onClose: () => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ onClose }) => {
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const executeTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const results = runAutomatedTests();
      setTestResults(results);
      setIsRunning(false);
    }, 250);
  };

  useEffect(() => {
    executeTests();
  }, []);

  const total = testResults.length;
  const passedCount = testResults.filter((r) => r.passed).length;
  const allPassed = total > 0 && passedCount === total;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E5DCCE]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E5DCCE] bg-[#F7F1E7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#286B61]/10 text-[#286B61] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8F2635] font-semibold">
                BẢO ĐẢM CHẤT LƯỢNG · QA & AUTOMATION
              </span>
              <h3 className="text-lg font-serif font-bold text-[#2C241E]">
                Quy Trình Kiểm Thử Tự Động Toàn Hệ Thống
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6C6258] hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Strip */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F7F1E7] border border-[#E5DCCE]">
            <div className="flex items-center gap-3">
              {allPassed ? (
                <CheckCircle2 className="w-6 h-6 text-[#286B61]" />
              ) : (
                <XCircle className="w-6 h-6 text-[#8F2635]" />
              )}
              <div>
                <div className="text-xs font-semibold text-[#2C241E]">
                  Trạng thái: {allPassed ? '100% Bộ Test Vượt Qua' : 'Đang xử lý kiểm thử...'}
                </div>
                <div className="text-[11px] text-[#6C6258] mt-0.5">
                  Đã kiểm tra {passedCount}/{total} ca kiểm thử logic văn hóa & giải phẫu cổ y.
                </div>
              </div>
            </div>

            <button
              onClick={executeTests}
              disabled={isRunning}
              className="px-3.5 py-1.5 rounded-lg border border-[#8F2635] text-[#8F2635] hover:bg-[#8F2635]/5 transition-colors text-xs font-medium flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>Chạy lại</span>
            </button>
          </div>

          {/* Test Case Items */}
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {testResults.map((test, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-[#E5DCCE] bg-white flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  {test.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#286B61] mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#8F2635] mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-medium text-[#2C241E]">{test.name}</div>
                    {test.message && (
                      <div className="text-[11px] text-[#6C6258] mt-0.5 font-light">{test.message}</div>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-stone-400 font-mono flex-shrink-0">
                  {test.durationMs.toFixed(1)}ms
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E5DCCE] bg-[#F7F1E7] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#8F2635] text-white hover:bg-[#701D29] text-xs font-medium"
          >
            Đóng bảng kiểm thử
          </button>
        </div>

      </div>
    </div>
  );
};
