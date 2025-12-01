import { body, validationResult } from "express-validator";

// Validation rules for creating events
export const createEventValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .notEmpty()
    .withMessage("Description is required"),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format (use ISO format)"),

  body("time")
    .notEmpty()
    .withMessage("Time is required"),

  body("location")
    .notEmpty()
    .withMessage("Location is required"),

  body("faculty")
    .notEmpty()
    .withMessage("Faculty is required")
    .isIn([
      "COMPUTING",
      "ENGINEERING",
      "BUSINESS",
      "HUMANITIES",
      "SCIENCE",
      "SLIIT_BUSINESS_SCHOOL",
      "ALL_FACULTIES",
    ])
    .withMessage("Invalid faculty"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
      "WORKSHOP",
      "COMPETITION",
      "SEMINAR",
      "CULTURAL",
      "SPORTS",
      "CAREER",
      "ACADEMIC",
      "SOCIAL",
      "PROFESSIONAL",
      "INDUSTRY_VISIT",
      "JOB_FAIR",
      "CAREER_WORKSHOP",
      "INTERVIEW_PREPARATION",
      "NETWORKING_EVENT",
      "PROFESSIONAL_DEVELOPMENT",
      "INTERNSHIP_PROGRAM",
      "GUEST_LECTURE",
    ])
    .withMessage("Invalid category"),

  body("organizer")
    .notEmpty()
    .withMessage("Organizer is required"),

  // Optional fields validation
  body("maxParticipants")
    .optional()
    .isInt({ min: 1 })
    .withMessage("maxParticipants must be a positive number"),

  body("price")
    .optional()
    .isIn(["Free", "Paid"])
    .withMessage("Price must be Free or Paid"),

  body("status")
    .optional()
    .isIn(["Active", "Inactive", "Cancelled", "Completed", "Draft"])
    .withMessage("Invalid status"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("requirements").optional().isArray().withMessage("Requirements must be an array"),
  body("prizes").optional().isArray().withMessage("Prizes must be an array"),
  
  // Image validation - allow base64 strings or empty
  body("image")
    .optional()
    .custom((value) => {
      if (value && typeof value === 'string' && value.length > 0) {
        // Check if it's a base64 string (data URL format)
        if (!value.startsWith('data:image/')) {
          throw new Error('Image must be a valid base64 data URL');
        }
      }
      return true;
    })
];

// Validation middleware for handling validation results
export const validateEvent = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Validation rules for updating events (less strict)
export const updateEventValidation = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title cannot be empty"),

  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format (use ISO format)"),

  body("faculty")
    .optional()
    .isIn([
      "COMPUTING",
      "ENGINEERING",
      "BUSINESS",
      "HUMANITIES",
      "SCIENCE",
      "SLIIT_BUSINESS_SCHOOL",
      "ALL_FACULTIES",
    ])
    .withMessage("Invalid faculty"),

  body("category")
    .optional()
    .isIn([
      "WORKSHOP",
      "COMPETITION",
      "SEMINAR",
      "CULTURAL",
      "SPORTS",
      "CAREER",
      "ACADEMIC",
      "SOCIAL",
      "PROFESSIONAL",
      "INDUSTRY_VISIT",
      "JOB_FAIR",
      "CAREER_WORKSHOP",
      "INTERVIEW_PREPARATION",
      "NETWORKING_EVENT",
      "PROFESSIONAL_DEVELOPMENT",
      "INTERNSHIP_PROGRAM",
      "GUEST_LECTURE",
    ])
    .withMessage("Invalid category"),

  body("maxParticipants")
    .optional()
    .isInt({ min: 1 })
    .withMessage("maxParticipants must be a positive number"),

  body("price")
    .optional()
    .isIn(["Free", "Paid"])
    .withMessage("Price must be Free or Paid"),

  body("status")
    .optional()
    .isIn(["Active", "Inactive", "Cancelled", "Completed", "Draft"])
    .withMessage("Invalid status"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("requirements").optional().isArray().withMessage("Requirements must be an array"),
  body("prizes").optional().isArray().withMessage("Prizes must be an array"),
  
  // Image validation for updates
  body("image")
    .optional()
    .custom((value) => {
      if (value && typeof value === 'string' && value.length > 0) {
        // Check if it's a base64 string (data URL format)
        if (!value.startsWith('data:image/')) {
          throw new Error('Image must be a valid base64 data URL');
        }
      }
      return true;
    })
];

export const validateEventUpdate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Update validation errors:', errors.array());
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Registration validation
export const validateRegistration = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Registration validation failed',
      errors: errors.array()
    });
  }
  next();
};
