import { useState } from 'react';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import useAuth from '../hooks/useAuth';
import { generateDietPlan } from '../services/dietService';
import { extractErrorMessage } from '../utils/helpers';

function DietPlanGeneratorPage() {
  const { user } = useAuth();
  const [goal, setGoal] = useState('');
  const [dietPlan, setDietPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    
    if (!goal.trim()) {
      toast.error('Please enter your health goal or preference');
      return;
    }

    setIsLoading(true);
    setError('');
    setDietPlan(null);

    try {
      const response = await generateDietPlan(goal);
      setDietPlan(response);
      toast.success('Diet plan generated successfully!');
    } catch (err) {
      const message = extractErrorMessage(err, 'Failed to generate diet plan');
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setGoal('');
    setDietPlan(null);
    setError('');
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-serif text-slate-900">Personalized Diet Plan Generator</h2>
        <p className="mt-1 font-serif italic text-slate-600">
          Get AI-powered nutrition recommendations based on your prescription history
        </p>
      </div>

      <div className="rounded-card border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleGeneratePlan} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900">
              What is your health goal or preference?
            </label>
            <p className="mt-1 text-xs text-slate-600">
              Examples: "Recovery from fever", "Boost immunity", "Maintain energy levels", "Improve digestion"
            </p>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Describe your health goal in detail..."
              className="mt-3 w-full rounded border border-slate-300 px-4 py-3 text-sm focus:border-medicalBlue focus:outline-none focus:ring-1 focus:ring-medicalBlue"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading || !goal.trim()}
              className="flex-1 rounded-lg bg-medicalBlue px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating Plan...' : 'Generate Diet Plan'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {isLoading && (
        <div className="rounded border border-slate-200 bg-white p-6 shadow-sm">
          <Loader text="Analyzing your prescriptions and generating a personalized diet plan..." />
        </div>
      )}

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">Error</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {dietPlan && !isLoading && (
        <div className="space-y-4">
          <div className="rounded-card border border-green-300 bg-green-50 p-6 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <span className="text-3xl">✅</span>
              <div>
                <h3 className="text-xl font-serif font-semibold text-green-900">
                  Your Personalized Diet Plan
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  Generated based on your medical history and health goal
                </p>
              </div>
            </div>

            <div className="mb-4 rounded border border-green-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-700">Your Goal:</p>
              <p className="mt-1 text-slate-800 italic">{dietPlan.goal}</p>
            </div>

            <div className="prose prose-sm max-w-none rounded border border-slate-200 bg-white p-6">
              <div className="whitespace-pre-wrap font-serif text-slate-800">
                {dietPlan.dietPlan}
              </div>
            </div>

            <div className="mt-4 border-t border-green-200 pt-4 text-xs text-green-600">
              <p>
                ℹ️ This plan is based on your {dietPlan.prescriptionCount} prescription record(s).
                Always consult your healthcare provider before making significant dietary changes.
              </p>
            </div>
          </div>

          <button
            onClick={handleClear}
            className="w-full rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Generate Another Plan
          </button>
        </div>
      )}

      {!dietPlan && !isLoading && !error && (
        <div className="rounded-card border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-600">
            Enter your health goal above to receive personalized diet recommendations based on your prescription history.
          </p>
        </div>
      )}
    </section>
  );
}

export default DietPlanGeneratorPage;
