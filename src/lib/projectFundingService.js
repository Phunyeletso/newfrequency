import { supabase } from "./supabaseClient";
import { createProjectFundingService } from "./projectFundingServiceCore";

export const projectFundingService = createProjectFundingService(supabase);
