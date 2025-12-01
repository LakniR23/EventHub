# Event Form Fields Mapping

This document shows how each database field should be represented in your frontend event add/edit form.

## Required Form Fields

### Basic Information

```html
<!-- Title (required) -->
<input type="text" name="title" required placeholder="Event Title" />

<!-- Short Description (required) -->
<textarea
  name="description"
  required
  placeholder="Brief event description"
></textarea>

<!-- Full Description (optional) -->
<textarea
  name="fullDescription"
  placeholder="Detailed event description"
></textarea>
```

### Date & Time

```html
<!-- Event Date (required) -->
<input type="datetime-local" name="date" required />

<!-- End Date (optional) -->
<input type="datetime-local" name="endDate" />

<!-- Time Display (required) -->
<input type="text" name="time" required placeholder="e.g., 9:00 AM - 6:00 PM" />
```

### Location & Organization

```html
<!-- Location (required) -->
<input type="text" name="location" required placeholder="Event venue" />

<!-- Faculty (required) -->
<select name="faculty" required>
  <option value="">Select Faculty</option>
  <option value="COMPUTING">Faculty of Computing</option>
  <option value="ENGINEERING">Faculty of Engineering</option>
  <option value="BUSINESS">Faculty of Business</option>
  <option value="HUMANITIES">Faculty of Humanities</option>
  <option value="SCIENCE">Faculty of Science</option>
  <option value="SLIIT_BUSINESS_SCHOOL">SLIIT Business School</option>
  <option value="ALL_FACULTIES">All Faculties</option>
</select>

<!-- Category (required) -->
<select name="category" required>
  <option value="">Select Category</option>
  <option value="WORKSHOP">Workshop</option>
  <option value="COMPETITION">Competition</option>
  <option value="SEMINAR">Seminar</option>
  <option value="CULTURAL">Cultural</option>
  <option value="SPORTS">Sports</option>
  <option value="CAREER">Career</option>
  <option value="ACADEMIC">Academic</option>
  <option value="SOCIAL">Social</option>
  <option value="PROFESSIONAL">Professional</option>
  <option value="INDUSTRY_VISIT">Industry Visit</option>
  <option value="JOB_FAIR">Job Fair</option>
  <option value="CAREER_WORKSHOP">Career Workshop</option>
  <option value="INTERVIEW_PREPARATION">Interview Preparation</option>
  <option value="NETWORKING_EVENT">Networking Event</option>
  <option value="PROFESSIONAL_DEVELOPMENT">Professional Development</option>
  <option value="INTERNSHIP_PROGRAM">Internship Program</option>
  <option value="GUEST_LECTURE">Guest Lecture</option>
</select>

<!-- Organizer (required) -->
<input type="text" name="organizer" required placeholder="Organizing body" />
```

### Registration Details

```html
<!-- Max Participants (optional) -->
<input
  type="number"
  name="maxParticipants"
  min="1"
  placeholder="Maximum participants"
/>

<!-- Price -->
<select name="price">
  <option value="Free">Free</option>
  <option value="Paid">Paid</option>
</select>

<!-- Featured Event -->
<input type="checkbox" name="featured" id="featured" />
<label for="featured">Featured Event</label>

<!-- Has Registration -->
<input type="checkbox" name="hasRegistration" id="hasRegistration" checked />
<label for="hasRegistration">Requires Registration</label>

<!-- Status -->
<select name="status">
  <option value="Active">Active</option>
  <option value="Completed">Completed</option>
  <option value="Cancelled">Cancelled</option>
</select>
```

### Arrays (Tags, Requirements, Prizes)

```html
<!-- Tags (comma-separated) -->
<input
  type="text"
  name="tags"
  placeholder="Tags (comma-separated): Coding, AI, Competition"
/>

<!-- Requirements (one per line) -->
<textarea
  name="requirements"
  placeholder="Requirements (one per line):
Laptop required
University ID
Team of 2-4 members"
></textarea>

<!-- Prizes (one per line) -->
<textarea
  name="prizes"
  placeholder="Prizes (one per line):
1st Place: $1000
2nd Place: $500
3rd Place: $250"
></textarea>
```

### Event Agenda (JSON)

```html
<div id="agenda-section">
  <h3>Event Agenda</h3>
  <div class="agenda-item">
    <input type="text" name="agenda[0][time]" placeholder="9:00 AM" />
    <input type="text" name="agenda[0][activity]" placeholder="Registration" />
    <button type="button" onclick="removeAgendaItem(0)">Remove</button>
  </div>
  <button type="button" onclick="addAgendaItem()">Add Agenda Item</button>
</div>
```

### Speakers (JSON)

```html
<div id="speakers-section">
  <h3>Speakers</h3>
  <div class="speaker-item">
    <input type="text" name="speakers[0][name]" placeholder="Speaker Name" />
    <input type="text" name="speakers[0][role]" placeholder="Job Title" />
    <input type="text" name="speakers[0][topic]" placeholder="Speaking Topic" />
    <input type="text" name="speakers[0][image]" placeholder="Image URL" />
    <textarea name="speakers[0][bio]" placeholder="Speaker Bio"></textarea>
    <button type="button" onclick="removeSpeaker(0)">Remove</button>
  </div>
  <button type="button" onclick="addSpeaker()">Add Speaker</button>
</div>
```

### Contact Information (JSON)

```html
<div id="contact-section">
  <h3>Contact Information</h3>
  <input
    type="text"
    name="contact[coordinator]"
    placeholder="Event Coordinator"
  />
  <input type="email" name="contact[email]" placeholder="Contact Email" />
  <input type="tel" name="contact[phone]" placeholder="Phone Number" />
  <input type="text" name="contact[office]" placeholder="Office Location" />
  <input type="url" name="contact[website]" placeholder="Event Website" />
</div>
```

### Career-Specific Fields (Optional)

```html
<div id="career-fields" style="display: none;">
  <h3>Career Event Details</h3>
  <input type="text" name="company" placeholder="Company Name" />
  <input type="text" name="industry" placeholder="Industry Sector" />
  <textarea
    name="jobOpportunities"
    placeholder="Available Job Positions"
  ></textarea>
  <textarea
    name="internshipOpportunities"
    placeholder="Internship Details"
  ></textarea>
  <textarea name="skillsRequired" placeholder="Required Skills"></textarea>
  <input type="text" name="dresscode" placeholder="Dress Code" />
</div>
```

### Media

```html
<!-- Event Image -->
<input type="text" name="image" placeholder="Event banner image URL" />
<!-- Or file upload -->
<input type="file" name="imageFile" accept="image/*" />
```

## JavaScript Form Processing

```javascript
// Process form data before sending to API
function processEventFormData(formData) {
  const processedData = { ...formData };

  // Process arrays
  if (processedData.tags && typeof processedData.tags === "string") {
    processedData.tags = processedData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
  }

  if (
    processedData.requirements &&
    typeof processedData.requirements === "string"
  ) {
    processedData.requirements = processedData.requirements
      .split("\n")
      .filter((req) => req.trim());
  }

  if (processedData.prizes && typeof processedData.prizes === "string") {
    processedData.prizes = processedData.prizes
      .split("\n")
      .filter((prize) => prize.trim());
  }

  // Process agenda array
  if (processedData.agenda) {
    processedData.agenda = processedData.agenda.filter(
      (item) => item.time && item.activity
    );
  }

  // Process speakers array
  if (processedData.speakers) {
    processedData.speakers = processedData.speakers.filter(
      (speaker) => speaker.name && speaker.role
    );
  }

  // Ensure boolean fields
  processedData.featured =
    processedData.featured === true || processedData.featured === "true";
  processedData.hasRegistration =
    processedData.hasRegistration === true ||
    processedData.hasRegistration === "true";

  // Convert numeric fields
  if (processedData.maxParticipants) {
    processedData.maxParticipants = parseInt(processedData.maxParticipants);
  }

  return processedData;
}

// Show/hide career fields based on category
function toggleCareerFields(category) {
  const careerFields = document.getElementById("career-fields");
  const careerCategories = [
    "CAREER",
    "JOB_FAIR",
    "CAREER_WORKSHOP",
    "INTERNSHIP_PROGRAM",
  ];

  if (careerCategories.includes(category)) {
    careerFields.style.display = "block";
  } else {
    careerFields.style.display = "none";
  }
}

// Dynamic agenda management
let agendaCount = 1;
function addAgendaItem() {
  const agendaSection = document.getElementById("agenda-section");
  const div = document.createElement("div");
  div.className = "agenda-item";
  div.innerHTML = `
    <input type="text" name="agenda[${agendaCount}][time]" placeholder="Time" />
    <input type="text" name="agenda[${agendaCount}][activity]" placeholder="Activity" />
    <button type="button" onclick="removeAgendaItem(${agendaCount})">Remove</button>
  `;
  agendaSection.appendChild(div);
  agendaCount++;
}

// Dynamic speakers management
let speakerCount = 1;
function addSpeaker() {
  const speakersSection = document.getElementById("speakers-section");
  const div = document.createElement("div");
  div.className = "speaker-item";
  div.innerHTML = `
    <input type="text" name="speakers[${speakerCount}][name]" placeholder="Speaker Name" />
    <input type="text" name="speakers[${speakerCount}][role]" placeholder="Job Title" />
    <input type="text" name="speakers[${speakerCount}][topic]" placeholder="Speaking Topic" />
    <input type="text" name="speakers[${speakerCount}][image]" placeholder="Image URL" />
    <textarea name="speakers[${speakerCount}][bio]" placeholder="Speaker Bio"></textarea>
    <button type="button" onclick="removeSpeaker(${speakerCount})">Remove</button>
  `;
  speakersSection.appendChild(div);
  speakerCount++;
}
```

## API Usage Example

```javascript
// Create event via API
async function createEvent(eventData) {
  try {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(processEventFormData(eventData)),
    });

    const result = await response.json();

    if (result.success) {
      alert("Event created successfully!");
      // Redirect or refresh
    } else {
      alert("Error: " + result.message);
    }
  } catch (error) {
    console.error("Error creating event:", error);
    alert("Failed to create event. Please try again.");
  }
}
```

This form structure ensures all database fields are captured and properly formatted before sending to your API endpoints.
