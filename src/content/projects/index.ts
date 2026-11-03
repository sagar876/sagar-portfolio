import { airfiAirlineCopilot } from "@/content/projects/airfi-airline-copilot";
import { airfiOfflineSync } from "@/content/projects/airfi-offline-sync";
import { airfiRealtimePlatform } from "@/content/projects/airfi-realtime-platform";
import { fabricAdminPerformance } from "@/content/projects/fabric-admin-performance";
import { fabricUiLibrary } from "@/content/projects/fabric-ui-library";
import { happayInvoiceManagement } from "@/content/projects/happay-invoice-management";
import { ninestackCms } from "@/content/projects/ninestack-cms";
import { superfitNovember } from "@/content/projects/superfit-november";
import { type Project } from "@/types/content";

/** All case studies, in display order. Each project lives in its own file. */
export const projects: readonly Project[] = [
  superfitNovember,
  ninestackCms,
  airfiRealtimePlatform,
  happayInvoiceManagement,
  airfiOfflineSync,
  fabricUiLibrary,
  fabricAdminPerformance,
  airfiAirlineCopilot,
];
