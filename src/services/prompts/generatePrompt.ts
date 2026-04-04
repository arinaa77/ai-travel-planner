import { GenerateInput } from "@/services/generateService";

export const GENERATE_SYSTEM_PROMPT = `You are an expert travel planner. \
Create detailed, realistic day-by-day itineraries with accurate cost estimates. \
Include a mix of sightseeing, food, and travel logistics. \
All costs must be in USD and reflect real-world prices for the destination.`;

export function buildGenerateUserPrompt(input: GenerateInput): string {
  return `Create a ${input.days}-day itinerary for ${input.destination} with a $${input.budget} total budget. \
Travel style: ${input.style}.

Return:
1. A day-by-day itinerary with timed events (travel, sights, food, hotel)
2. A budget breakdown (flights, hotel, food budget, activities, total)
3. Top attraction per day — label: "Day N", value: short place name only (e.g. "Meiji Shrine"), max 4 words
4. Food highlight per day — label: "Day N dinner/breakfast/lunch", value: short restaurant or dish name only (e.g. "Ichiran Ramen"), max 4 words

Rules:
- All event costs must be realistic USD prices. Use null for free events.
- Budget breakdown values must be dollar amounts (e.g. "$420"), last item must be "Total"
- Attraction and food values must be SHORT NAMES ONLY — never descriptions or sentences`;
}
