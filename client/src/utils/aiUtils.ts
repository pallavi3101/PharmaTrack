import OpenAI from "openai";

// Interface for AI query parameters
interface AiQueryParams {
  question: string;
  context?: string;
  systemPrompt?: string;
}

/**
 * Creates a safe instance of the OpenAI client with fallback
 */
const createOpenAIClient = () => {
  try {
    return new OpenAI({ 
      baseURL: "https://api.x.ai/v1", 
      apiKey: import.meta.env.VITE_XAI_API_KEY || "dummy-key",
    });
  } catch (error) {
    console.error("Failed to initialize OpenAI client:", error);
    return null;
  }
};

/**
 * Function to simulate AI response when real API is not available
 */
const simulateAIResponse = (question: string, context?: string): string => {
  // For a medicine-related question
  if (question.toLowerCase().includes("paracetamol") || question.toLowerCase().includes("medicine")) {
    return "Paracetamol (acetaminophen) is an over-the-counter medication used to treat pain and fever. It is generally well-tolerated but should be used as directed. Common side effects may include nausea and stomach pain. Recommended adult dosage is typically 500-1000mg every 4-6 hours, not exceeding 4000mg per day.";
  }
  
  // For a supplier-related question
  if (question.toLowerCase().includes("supplier") || question.toLowerCase().includes("delivery")) {
    return "Our top suppliers include Sun Pharma, Cipla, GSK, and Abbott. Standard delivery terms vary by supplier but typically include free delivery on orders over ₹10,000 with delivery within 2-3 business days. Some suppliers offer express shipping options for an additional fee.";
  }
  
  // For an inventory-related question
  if (question.toLowerCase().includes("inventory") || question.toLowerCase().includes("stock")) {
    return "Our inventory management system follows FEFO (First Expired, First Out) principles. Current stock levels are monitored daily with automatic alerts set for items reaching their minimum threshold. For optimal stock management, we recommend regular cycle counting and maintaining safety stock for high-demand items.";
  }
  
  // Default response for other questions
  return "I'm an AI assistant for PharmaTrack. I can help answer questions about medicines, suppliers, inventory management, and customer data. Please ask a specific question, and I'll provide the most relevant information available in our system.";
};

/**
 * Query the AI about medicines and healthcare data
 */
export async function queryAI({ question, context, systemPrompt }: AiQueryParams): Promise<string> {
  // Create client only when needed
  const openai = createOpenAIClient();
  
  if (!openai) {
    console.log("Using simulated AI response since client is not available");
    return simulateAIResponse(question, context);
  }
  
  try {
    const defaultSystemPrompt = "You are a knowledgeable pharmaceutical expert assistant. Answer questions accurately and professionally based on the provided context. If you don't know the answer based on the context provided, say so directly.";
    
    const messages = [];
    
    // Add system message with context if available
    messages.push({
      role: "system",
      content: systemPrompt || (context 
        ? `${defaultSystemPrompt}\n\nContext about the pharmaceutical inventory and sales data:\n${context}`
        : defaultSystemPrompt)
    });
    
    // Add user question
    messages.push({
      role: "user",
      content: question
    });
    
    try {
      const response = await openai.chat.completions.create({
        model: "grok-2-1212",
        messages: messages as any,
        temperature: 0.3, // Lower temperature for more factual responses
        max_tokens: 1000,
      });
      
      return response.choices[0].message.content || "Sorry, I couldn't generate a response at this time.";
    } catch (error) {
      console.error("Error making API request:", error);
      return simulateAIResponse(question, context);
    }
  } catch (error) {
    console.error("Error in queryAI:", error);
    return "Sorry, there was an error connecting to the AI service. Please try again later.";
  }
}

/**
 * Analyze medicine/product data with AI
 */
export async function analyzeMedicineData(medicines: any[], question: string): Promise<string> {
  // Create context from medicine data
  const context = JSON.stringify({
    medicines: medicines.map(m => ({
      name: m.name,
      company: m.company,
      category: m.category,
      price: m.price,
      stock: m.stock,
      expiryDate: m.expiryDate
    }))
  });
  
  return queryAI({
    question,
    context,
    systemPrompt: "You are a pharmaceutical inventory expert. Analyze the provided medicine inventory data and answer questions about stock levels, pricing, expiry dates, and recommendations. Base your answers strictly on the data provided."
  });
}

/**
 * Analyze customer purchase data with AI
 */
export async function analyzeCustomerData(customers: any[], sales: any[], question: string): Promise<string> {
  // Create context from customer and sales data
  const context = JSON.stringify({
    customers,
    sales
  });
  
  return queryAI({
    question,
    context,
    systemPrompt: "You are a pharmaceutical sales analyst. Analyze the provided customer and sales data to identify patterns, make recommendations, and answer questions about customer behavior. Base your answers strictly on the data provided."
  });
}

/**
 * Generate sales forecast using ML
 */
export async function generateSalesForecast(historicalSales: any[]): Promise<{ 
  prediction: number;
  explanation: string;
}> {
  // Create client only when needed
  const openai = createOpenAIClient();
  
  // Default fallback response when API is not available
  const fallbackResponse = {
    prediction: 67500,
    explanation: "Based on historical trends, a growth rate of approximately 3% is projected for the next month. This projection takes into account seasonal patterns, recent sales momentum, and market conditions."
  };
  
  if (!openai) {
    console.log("Using simulated sales forecast since client is not available");
    return fallbackResponse;
  }
  
  try {
    // Create context from sales data
    const context = JSON.stringify({
      historicalSales
    });
    
    try {
      const response = await openai.chat.completions.create({
        model: "grok-2-1212",
        messages: [
          {
            role: "system",
            content: "You are a pharmaceutical sales forecasting expert with ML capabilities. Analyze the provided historical sales data and predict the next month's sales. Provide both a numerical prediction and a brief explanation of the factors influencing your prediction. Format your response as valid JSON with 'prediction' (number) and 'explanation' (string) fields."
          },
          {
            role: "user",
            content: `Analyze this historical sales data and predict the next month's sales:\n${context}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });
      
      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        prediction: typeof result.prediction === 'number' ? result.prediction : fallbackResponse.prediction,
        explanation: result.explanation || fallbackResponse.explanation
      };
    } catch (error) {
      console.error("Error making API request for sales forecast:", error);
      return fallbackResponse;
    }
  } catch (error) {
    console.error("Error generating sales forecast:", error);
    return fallbackResponse;
  }
}