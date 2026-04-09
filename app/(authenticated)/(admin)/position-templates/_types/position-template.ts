import { PositionTemplate, PositionTemplateItem } from "@/types/database";

export interface PositionTemplateWithItems extends PositionTemplate {
  items: PositionTemplateItem[];
}