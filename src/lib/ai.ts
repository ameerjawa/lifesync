import { HfInference } from '@huggingface/inference';
import { useTaskStore } from '../store/taskStore';
import { useHealthStore } from '../store/healthStore';
import { useFinanceStore } from '../store/financeStore';
import { useToastStore } from '../store/toastStore';
import type { Road, Milestone } from './types';

const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.2';

const hf = HUGGINGFACE_API_KEY ? new HfInference(HUGGINGFACE_API_KEY) : null;

interface AIAction {
  type: string;
  data?: any;
  navigate?: string;
  message?: string;
}

async function generateAIResponse(prompt: string): Promise<string> {
  if (!hf) {
    throw new Error('Hugging Face API key not configured');
  }

  try {
    const response = await hf.textGeneration({
      model: MODEL_ID,
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false
      }
    });

    return response.generated_text.trim();
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}

export async function processUserInput(
  input: string,
  context: {
    section: string;
    navigate: (path: string) => void;
  }
): Promise<{ response: string; actions: AIAction[] }> {
  const lowerInput = input.toLowerCase();
  const actions: AIAction[] = [];

  // Navigation commands
  if (lowerInput.includes('go to') || lowerInput.includes('show me') || lowerInput.includes('open')) {
    const section = 
      lowerInput.includes('task') ? '/dashboard/tasks' :
      lowerInput.includes('health') ? '/dashboard/health' :
      lowerInput.includes('finance') ? '/dashboard/finance' :
      lowerInput.includes('goal') ? '/dashboard/goals' :
      lowerInput.includes('road') ? '/dashboard/roads' :
      lowerInput.includes('analytic') ? '/dashboard/analytics' :
      lowerInput.includes('setting') ? '/dashboard/settings' :
      null;

    if (section) {
      actions.push({
        type: 'navigate',
        navigate: section,
        message: `Navigating to ${section.split('/').pop()}...`
      });
    }
  }

  // Task commands
  if (lowerInput.includes('create task') || lowerInput.includes('add task')) {
    const title = input.replace(/create|add|task|todo/gi, '').trim();
    actions.push({
      type: 'create_task',
      data: {
        title,
        status: 'todo',
        priority: 'medium',
        due_date: new Date().toISOString()
      },
      message: `Creating task: ${title}`
    });
  }

  // Health tracking commands
  if (lowerInput.includes('track') || lowerInput.includes('log')) {
    const metricTypes = ['weight', 'steps', 'sleep', 'water', 'mood', 'exercise'];
    const matchedMetric = metricTypes.find(type => lowerInput.includes(type));
    
    if (matchedMetric) {
      const value = parseFloat(input.match(/\d+(\.\d+)?/)?.[0] || '0');
      actions.push({
        type: 'track_health',
        data: {
          metric_type: matchedMetric,
          value,
          recorded_at: new Date().toISOString()
        },
        message: `Tracking ${matchedMetric}: ${value}`
      });
    }
  }

  // Finance commands
  if (lowerInput.includes('add transaction') || lowerInput.includes('record payment')) {
    const amount = parseFloat(input.match(/\$?\d+(\.\d+)?/)?.[0] || '0');
    const type = lowerInput.includes('income') ? 'income' : 'expense';
    
    actions.push({
      type: 'add_transaction',
      data: {
        amount,
        type,
        description: input,
        date: new Date().toISOString()
      },
      message: `Adding ${type} transaction: $${amount}`
    });
  }

  // Generate AI response
  const response = await generateAIResponse(`
    You are a helpful AI assistant for the LifeSync app. The user is in the ${context.section} section.
    User input: ${input}
    
    Respond naturally and conversationally. If you're performing actions, acknowledge them and provide next steps or suggestions.
    Keep responses concise but helpful.
  `);

  return { response, actions };
}

export async function executeActions(actions: AIAction[], navigate: (path: string) => void): Promise<void> {
  for (const action of actions) {
    try {
      switch (action.type) {
        case 'navigate':
          if (action.navigate) {
            navigate(action.navigate);
            useToastStore.getState().showSuccess(action.message || 'Navigation successful');
          }
          break;

        case 'create_task':
          await useTaskStore.getState().addTask(action.data);
          useToastStore.getState().showSuccess('Task created successfully');
          break;

        case 'track_health':
          await useHealthStore.getState().addMetric(action.data);
          useToastStore.getState().showSuccess('Health metric tracked successfully');
          break;

        case 'add_transaction':
          await useFinanceStore.getState().addTransaction(action.data);
          useToastStore.getState().showSuccess('Transaction added successfully');
          break;

        default:
          console.warn('Unknown action type:', action.type);
      }
    } catch (error) {
      console.error(`Error executing action ${action.type}:`, error);
      useToastStore.getState().showError(
        error instanceof Error ? error.message : 'Failed to execute action'
      );
    }
  }
}

export async function generateTaskSuggestions(tasks: any[], preferences: any = {}): Promise<any[]> {
  try {
    const prompt = `Based on the following tasks and preferences, suggest 3 new tasks:
      Current Tasks: ${JSON.stringify(tasks)}
      Preferences: ${JSON.stringify(preferences)}
    `;

    const response = await generateAIResponse(prompt);
    
    // Parse the response into task suggestions
    const suggestions = response.split('\n')
      .filter(line => line.trim())
      .slice(0, 3)
      .map(suggestion => ({
        title: suggestion,
        priority: 'medium',
        status: 'todo',
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }));

    return suggestions;
  } catch (error) {
    console.error('Error generating task suggestions:', error);
    return [];
  }
}

export async function analyzeTaskPerformance(tasks: any[]): Promise<any> {
  try {
    const prompt = `Analyze the following tasks and provide insights:
      Tasks: ${JSON.stringify(tasks)}
    `;

    const response = await generateAIResponse(prompt);
    
    return {
      insights: response.split('\n').filter(line => line.trim()),
      recommendations: [
        'Break down large tasks into smaller ones',
        'Set realistic deadlines',
        'Review progress regularly'
      ]
    };
  } catch (error) {
    console.error('Error analyzing tasks:', error);
    return {
      insights: [],
      recommendations: []
    };
  }
}

export async function generateTaskSchedule(tasks: any[]): Promise<any[]> {
  try {
    const prompt = `Generate an optimized schedule for these tasks:
      Tasks: ${JSON.stringify(tasks)}
    `;

    const response = await generateAIResponse(prompt);
    
    return tasks.map(task => ({
      ...task,
      suggested_start_time: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error generating schedule:', error);
    return tasks;
  }
}

export async function generateRoadImage(road: Road, theme: string): Promise<string> {
  try {
    if (!hf) {
      throw new Error('Hugging Face API key not configured');
    }

    // Generate a prompt based on the road theme and progress
    const prompt = `A beautiful ${theme} road journey visualization, showing progress at ${road.progress}%, 
      with milestones and achievements along the way. Style: ${road.theme}, 
      high quality, detailed, modern design, digital art`;

    const result = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-2-1',
      inputs: prompt,
      parameters: {
        negative_prompt: 'blurry, low quality, distorted',
        guidance_scale: 7.5,
        num_inference_steps: 50
      }
    });

    return URL.createObjectURL(result);
  } catch (error) {
    console.error('Error generating road image:', error);
    // Return a default placeholder image
    return 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3';
  }
}

export async function generateMilestoneImage(milestone: Milestone): Promise<string> {
  try {
    if (!hf) {
      throw new Error('Hugging Face API key not configured');
    }

    const prompt = `A symbolic representation of the milestone "${milestone.title}", 
      modern icon style, minimalistic, professional design`;

    const result = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-2-1',
      inputs: prompt,
      parameters: {
        negative_prompt: 'blurry, text, words, low quality',
        guidance_scale: 7.5,
        num_inference_steps: 50
      }
    });

    return URL.createObjectURL(result);
  } catch (error) {
    console.error('Error generating milestone image:', error);
    // Return a default placeholder image
    return 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?ixlib=rb-4.0.3';
  }
}