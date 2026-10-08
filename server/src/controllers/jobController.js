const mongoose = require('mongoose');
const Job = require('../models/Job');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const pick = require('../utils/pick');

const JOB_FIELDS = ['title', 'company', 'location', 'type', 'salary', 'description'];

const checkId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid job ID', 400);
};

// POST /api/jobs (protected)
exports.createJob = asyncHandler(async (req, res) => {
  const job = await Job.create({ ...pick(req.body, JOB_FIELDS), createdBy: req.user._id });
  res.status(201).json({ success: true, data: job });
});

// GET /api/jobs (public)
exports.getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().sort('-createdAt').populate('createdBy', 'name');
  res.status(200).json({ success: true, count: jobs.length, data: jobs });
});

// GET /api/jobs/:id (public)
exports.getJob = asyncHandler(async (req, res) => {
  checkId(req.params.id);
  const job = await Job.findById(req.params.id).populate('createdBy', 'name');
  if (!job) throw new AppError('Job not found', 404);
  res.status(200).json({ success: true, data: job });
});

// PUT /api/jobs/:id (protected)
exports.updateJob = asyncHandler(async (req, res) => {
  checkId(req.params.id);
  const job = await Job.findByIdAndUpdate(req.params.id, pick(req.body, JOB_FIELDS), {
    new: true,
    runValidators: true,
  });
  if (!job) throw new AppError('Job not found', 404);
  res.status(200).json({ success: true, data: job });
});

// DELETE /api/jobs/:id (protected)
exports.deleteJob = asyncHandler(async (req, res) => {
  checkId(req.params.id);
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) throw new AppError('Job not found', 404);
  res.status(200).json({ success: true, message: 'Job deleted successfully' });
});
