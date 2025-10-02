"use client";
import * as React from "react";
import { useRouter } from "next/navigation";

export default function ProfileDebugPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const addResult = (stepNum: number, success: boolean, data: any) => {
    setResults(prev => [...prev, { step: stepNum, success, data, timestamp: new Date().toISOString() }]);
  };

  const testStep = async (stepNum: number, testFn: () => Promise<any>, description: string) => {
    setStep(stepNum);
    setLoading(true);
    try {
      console.log(`Step ${stepNum}: ${description}`);
      const result = await testFn();
      addResult(stepNum, true, { description, result });
      return result;
    } catch (error: any) {
      console.error(`Step ${stepNum} failed:`, error);
      addResult(stepNum, false, { description, error: error.message });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const runTests = async () => {
    setResults([]);
    
    try {
      // Step 1: Test API URL
      await testStep(1, async () => {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
        return { API };
      }, "Check API URL");

      // Step 2: Test authentication
      await testStep(2, async () => {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
        const r = await fetch(`${API}/auth/me`, { credentials: "include", cache: "no-store" });
        
        if (r.status === 401) {
          // Redirect to login if not authenticated
          throw new Error(`Not authenticated. Please login first. Redirecting to login page...`);
        }
        
        if (!r.ok) throw new Error(`Auth failed: ${r.status} ${r.statusText}`);
        return await r.json();
      }, "Test authentication");

      // Step 3: Test profile API
      await testStep(3, async () => {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
        const r = await fetch(`${API}/users/profile`, { credentials: "include", cache: "no-store" });
        if (!r.ok) throw new Error(`Profile API failed: ${r.status} ${r.statusText}`);
        return await r.json();
      }, "Test profile API");

      // Step 4: Test support admins API
      await testStep(4, async () => {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
        const r = await fetch(`${API}/users/support-admins?page=1&limit=1`, { credentials: "include", cache: "no-store" });
        if (!r.ok) throw new Error(`Support admins API failed: ${r.status} ${r.statusText}`);
        return await r.json();
      }, "Test support admins API");

      // Step 5: Test components import
      await testStep(5, async () => {
        const ProfileView = (await import("@/components/admin/ProfileView")).default;
        const ProfileEdit = (await import("@/components/admin/ProfileEdit")).default;
        const Modal = (await import("@/components/ui/Modal")).default;
        return { ProfileView: !!ProfileView, ProfileEdit: !!ProfileEdit, Modal: !!Modal };
      }, "Test components import");

      setStep(6);
      addResult(6, true, { description: "All tests passed! Profile should work now." });

    } catch (error) {
      console.error("Test failed at step", step, error);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Profile System Debug</h1>
          
          <div className="flex gap-4 mb-6 flex-wrap">
            <button
              onClick={runTests}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Testing..." : "Run Tests"}
            </button>
            
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Go to Login
            </button>
            
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Go to Admin
            </button>
            
            <button
              onClick={() => {
                // Disable debug mode and go to real profile page
                const confirmed = confirm("Disable debug mode and go to real profile page?");
                if (confirmed) {
                  // This would need to be done manually by setting DEBUG_MODE = false
                  alert("Please set DEBUG_MODE = false in page.tsx and refresh");
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Go to Real Profile
            </button>
            
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Go Back
            </button>
          </div>

          {/* Authentication Status */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">🔐 Authentication Required</h3>
            <p className="text-yellow-700 text-sm mb-2">
              The profile page requires authentication. If you see a 401 error, please:
            </p>
            <ol className="text-yellow-700 text-sm list-decimal list-inside space-y-1">
              <li>Click "Go to Login" to login first</li>
              <li>Use admin or support admin credentials</li>
              <li>Come back to test the profile page</li>
            </ol>
          </div>

          {loading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Running Step {step}...</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.success 
                    ? "bg-green-50 border-green-200" 
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                    result.success ? "bg-green-500" : "bg-red-500"
                  }`}>
                    {result.step}
                  </span>
                  <span className="font-medium">{result.data.description}</span>
                  <span className={`text-sm ${result.success ? "text-green-600" : "text-red-600"}`}>
                    {result.success ? "✅ PASS" : "❌ FAIL"}
                  </span>
                </div>
                
                <div className="ml-8">
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {results.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Click "Run Tests" to start debugging the profile system
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
