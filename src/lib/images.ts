import heroSite from "@/assets/hero-site.jpg";
import teamMeeting from "@/assets/team-meeting.jpg";
import projectHarbor from "@/assets/project-harbor.jpg";
import projectOffice from "@/assets/project-office.jpg";
import projectInterior from "@/assets/project-interior.jpg";
import projectVilla from "@/assets/project-villa.jpg";
import projectWarehouse from "@/assets/project-warehouse.jpg";
import projectSchool from "@/assets/project-school.jpg";
import detailPlans from "@/assets/detail-plans.jpg";

export const imageLibrary: Record<string, string> = {
  hero: heroSite,
  team: teamMeeting,
  harbor: projectHarbor,
  office: projectOffice,
  interior: projectInterior,
  villa: projectVilla,
  warehouse: projectWarehouse,
  school: projectSchool,
  detail: detailPlans,
};

export const imageKeys = Object.keys(imageLibrary);

export function imageFor(key: string | null | undefined): string {
  return (key && imageLibrary[key]) || projectHarbor;
}
