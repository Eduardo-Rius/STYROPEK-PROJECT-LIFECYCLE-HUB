import { z } from "zod";

// Helper for validating date objects or ISO strings or Firestore Timestamps (as any or preprocess)
const dateSchema = z.union([
  z.date(),
  z.string().datetime(),
  z.any() // Handles Firebase Timestamp objects
]);

export const userSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  department: z.string().optional(),
  areaId: z.string().min(1, "Area ID is required"),
  plantId: z.string().min(1, "Plant ID is required"),
  position: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional()
});

export const plantSchema = z.object({
  plantId: z.string().min(1, "Plant ID is required"),
  plantName: z.string().min(1, "Plant name is required"),
  country: z.string().min(1, "Country is required"),
  location: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional()
});

export const areaSchema = z.object({
  areaId: z.string().min(1, "Area ID is required"),
  areaName: z.string().min(1, "Area name is required"),
  plantId: z.string().min(1, "Plant ID is required"),
  responsibleUserId: z.string().min(1, "Responsible user ID is required"),
  isActive: z.boolean().default(true),
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional()
});

export const projectTypeSchema = z.object({
  projectTypeId: z.string().min(1, "Project Type ID is required"),
  name: z.string().min(1, "Project type name is required"),
  description: z.string().optional(),
  requiresADP: z.boolean().default(false),
  requiresMOC: z.boolean().default(false),
  requiresPSSR: z.boolean().default(false),
  requiresSafetyReview: z.boolean().default(false),
  requiresTransmittal: z.boolean().default(false),
  requiresElectricalChecklist: z.boolean().default(false),
  requiresSAP: z.boolean().default(false),
  isActive: z.boolean().default(true)
});

export const projectSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  projectCode: z.string().min(1, "Project code is required"),
  projectName: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  site: z.string().min(1, "Site is required"),
  plantId: z.string().min(1, "Plant is required"),
  businessUnit: z.string().min(1, "Business Unit is required"),
  areaId: z.string().min(1, "Area is required"),
  department: z.string().min(1, "Department is required"),
  costCenter: z.string().min(1, "Cost Center is required"),
  requesterId: z.string().min(1, "Requester ID is required"),
  projectLeaderId: z.string().min(1, "Project Leader is required"),
  responsibleUserId: z.string().min(1, "Responsible User is required"),
  sponsorId: z.string().min(1, "Sponsor is required"),
  projectTypeId: z.string().min(1, "Project Type is required"),
  projectSubtype: z.string().optional(),
  investmentType: z.string().min(1, "Investment Type is required"),
  investmentFocus: z.string().min(1, "Investment Focus is required"),
  status: z.string().min(1, "Status is required"),
  currentStage: z.string().min(1, "Current Stage is required"),
  priority: z.string().min(1, "Priority is required"),
  riskLevel: z.string().min(1, "Risk Level is required"),
  estimatedBudgetUSD: z.number().nonnegative("Estimated budget must be positive"),
  approvedBudgetUSD: z.number().nonnegative().default(0),
  spentAmountUSD: z.number().nonnegative().default(0),
  estimatedStartDate: dateSchema,
  estimatedEndDate: dateSchema,
  actualStartDate: dateSchema.optional().nullable(),
  actualEndDate: dateSchema.optional().nullable(),
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional(),
  createdBy: z.string().min(1, "Created By user is required"),
  updatedBy: z.string().optional()
});

export const investmentRequestSchema = z.object({
  investmentRequestId: z.string().min(1, "Investment Request ID is required"),
  projectId: z.string().min(1, "Project ID is required"),
  requestName: z.string().min(1, "Request name is required"),
  requesterId: z.string().min(1, "Requester ID is required"),
  areaId: z.string().min(1, "Area is required"),
  costCenter: z.string().min(1, "Cost Center is required"),
  site: z.string().min(1, "Site is required"),
  background: z.string().min(5, "Background is required"),
  scopeDescription: z.string().min(5, "Scope description is required"),
  objectives: z.string().min(5, "Objectives are required"),
  expectedBenefits: z.string().min(5, "Expected benefits are required"),
  productionContribution: z.string().optional(),
  qualityContribution: z.string().optional(),
  safetyContribution: z.string().optional(),
  sustainabilityContribution: z.string().optional(),
  ITContribution: z.string().optional(),
  estimatedSavingsUSD: z.number().nonnegative().default(0),
  timeReductionHours: z.number().nonnegative().default(0),
  involvesFixedAssetReplacement: z.boolean().default(false),
  assetDescription: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  submittedAt: dateSchema.optional().nullable(),
  approvedAt: dateSchema.optional().nullable(),
  rejectedAt: dateSchema.optional().nullable(),
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional()
});

export const adpSchema = z.object({
  adpId: z.string().min(1, "ADP ID is required"),
  projectId: z.string().min(1, "Project ID is required"),
  version: z.number().int().positive().default(1),
  projectBackground: z.string().min(5, "Background is required"),
  projectObjective: z.string().min(5, "Objective is required"),
  deliverableScope: z.string().min(5, "Deliverable scope is required"),
  criticalVariables: z.string().optional(),
  processHazards: z.string().optional(),
  plantLocation: z.string().optional(),
  requiresSafetyReview1And2: z.boolean().default(false),
  safetyReviewReason: z.string().optional(),
  requiresPSSR: z.boolean().default(false),
  pssrReason: z.string().optional(),
  requiresMOCOperational: z.boolean().default(false),
  mocOperationalReason: z.string().optional(),
  requiresMOCAdministrative: z.boolean().default(false),
  mocAdministrativeReason: z.string().optional(),
  requiresBasicEngineering: z.boolean().default(false),
  requiresDetailEngineering: z.boolean().default(false),
  requiresMaintenanceDocumentation: z.boolean().default(false),
  assumptions: z.string().optional(),
  exclusions: z.string().optional(),
  estimatedDurationMonths: z.number().positive().default(1),
  criticalPath: z.string().optional(),
  paybackTime: z.string().optional(),
  successFactors: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  approvedAt: dateSchema.optional().nullable(),
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional()
});

export const actionItemSchema = z.object({
  actionId: z.string().min(1, "Action ID is required"),
  projectId: z.string().min(1, "Project ID is required"),
  sourceModule: z.string().min(1, "Source module is required"),
  sourceDocumentId: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  responsibleUserId: z.string().min(1, "Responsible user is required"),
  dueDate: dateSchema,
  completionDate: dateSchema.optional().nullable(),
  status: z.string().min(1, "Status is required"),
  priority: z.string().min(1, "Priority is required"),
  evidenceRequired: z.boolean().default(false),
  evidenceId: z.string().optional().nullable(),
  createdBy: z.string().min(1, "Created by is required"),
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional()
});

export const approvalSchema = z.object({
  approvalId: z.string().min(1, "Approval ID is required"),
  projectId: z.string().min(1, "Project ID is required"),
  module: z.string().min(1, "Module is required"),
  documentId: z.string().min(1, "Document ID is required"),
  approverId: z.string().min(1, "Approver ID is required"),
  approverRole: z.string().min(1, "Approver role is required"),
  approvalOrder: z.number().int().positive().default(1),
  status: z.string().min(1, "Status is required"),
  comments: z.string().optional(),
  requestedAt: dateSchema,
  approvedAt: dateSchema.optional().nullable(),
  rejectedAt: dateSchema.optional().nullable(),
  delegatedTo: z.string().optional().nullable(),
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional()
});

export const riskSchema = z.object({
  riskId: z.string().min(1, "Risk ID is required"),
  projectId: z.string().min(1, "Project ID is required"),
  riskCategory: z.string().min(1, "Risk category is required"),
  description: z.string().min(5, "Risk description is required"),
  probability: z.number().int().min(1).max(5),
  impact: z.number().int().min(1).max(5),
  riskLevel: z.string().min(1),
  mitigationPlan: z.string().min(5, "Mitigation plan is required"),
  responsibleUserId: z.string().min(1, "Responsible user is required"),
  status: z.string().min(1, "Status is required"),
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional()
});

export const scheduleSchema = z.object({
  scheduleId: z.string().min(1, "Schedule ID is required"),
  projectId: z.string().min(1, "Project ID is required"),
  taskName: z.string().min(1, "Task name is required"),
  taskDescription: z.string().optional(),
  ownerId: z.string().min(1, "Owner is required"),
  startDate: dateSchema,
  endDate: dateSchema,
  plannedProgress: z.number().min(0).max(100).default(0),
  actualProgress: z.number().min(0).max(100).default(0),
  dependencyIds: z.array(z.string()).default([]),
  isCriticalPath: z.boolean().default(false),
  status: z.string().min(1, "Status is required"),
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional()
});

export const documentSchema = z.object({
  documentId: z.string().min(1, "Document ID is required"),
  projectId: z.string().min(1, "Project ID is required"),
  documentType: z.string().min(1, "Document type is required"),
  fileName: z.string().min(1, "File name is required"),
  fileUrl: z.string().url("Invalid file URL"),
  storagePath: z.string().min(1, "Storage path is required"),
  fileExtension: z.string().min(1, "File extension is required"),
  fileSize: z.number().positive(),
  version: z.number().int().positive().default(1),
  uploadedBy: z.string().min(1, "Uploaded by is required"),
  uploadedAt: dateSchema,
  status: z.string().min(1, "Status is required"),
  tags: z.array(z.string()).default([]),
  relatedModule: z.string().optional(),
  requiresApproval: z.boolean().default(false),
  approvedAt: dateSchema.optional().nullable(),
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional()
});

export const evidenceSchema = z.object({
  evidenceId: z.string().min(1, "Evidence ID is required"),
  projectId: z.string().min(1, "Project ID is required"),
  actionId: z.string().min(1, "Action ID is required"),
  documentId: z.string().min(1, "Document ID is required"),
  evidenceType: z.string().min(1, "Evidence type is required"),
  fileUrl: z.string().url(),
  storagePath: z.string().min(1),
  description: z.string().optional(),
  uploadedBy: z.string().min(1),
  uploadedAt: dateSchema,
  validatedBy: z.string().optional().nullable(),
  validatedAt: dateSchema.optional().nullable(),
  status: z.string().min(1),
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional()
});

export const commentSchema = z.object({
  commentId: z.string().min(1),
  projectId: z.string().min(1),
  module: z.string().min(1),
  relatedId: z.string().min(1),
  userId: z.string().min(1),
  commentText: z.string().min(1, "Comment text cannot be empty"),
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional()
});

export const auditLogSchema = z.object({
  auditId: z.string().min(1),
  projectId: z.string().min(1),
  userId: z.string().min(1),
  action: z.string().min(1),
  module: z.string().min(1),
  previousValue: z.any().optional(),
  newValue: z.any().optional(),
  timestamp: dateSchema,
  ipAddress: z.string().optional()
});
