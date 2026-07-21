-- V2: Add validation answer hash column to lost_found_items table
ALTER TABLE lost_found_items ADD COLUMN validation_answer_hash VARCHAR(255);
