import fs from 'fs';
import path from 'path';

const initiativesFilePath = path.join(process.cwd(), 'database', 'initiatives.json');

function initializeInitiatives() {
  try {
    const dir = path.dirname(initiativesFilePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const defaultInitiatives = {
      initiatives: [
        {
          id: 1,
          title: "Youth Education Scholarship Program",
          short_description: "Supporting underprivileged students with quality education",
          description: "A comprehensive scholarship program aimed at providing quality education to underprivileged students across the country. We focus on removing financial barriers to education.",
          type: "campaigns",
          organizer_id: 2,
          organizer_name: "Organizer1 Khan",
          date: "2026-03-15",
          time: "10:00",
          banner_url: "https://images.unsplash.com/photo-1427504494785-cdafb3d3b798",
          manpower: 50,
          expected_budget: 500000,
          bkash_number: "01700000001",
          nagad_number: "01800000001",
          bank_account: "1234567890",
          created_at: "2026-03-09T06:00:00.000Z",
          updated_at: "2026-03-09T06:00:00.000Z"
        }
      ]
    };

    if (!fs.existsSync(initiativesFilePath)) {
      fs.writeFileSync(
        initiativesFilePath,
        JSON.stringify(defaultInitiatives, null, 2)
      );
      console.log('✅ Initiatives database initialized successfully!');
    } else {
      console.log('✅ Initiatives database already exists!');
    }
  } catch (error) {
    console.error('Error initializing initiatives database:', error);
  }
}

initializeInitiatives();
