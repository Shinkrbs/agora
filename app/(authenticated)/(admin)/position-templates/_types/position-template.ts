import { PositionTemplate } from "@/types/database";

export type InsertPositionTemplate = Omit<PositionTemplate, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>;