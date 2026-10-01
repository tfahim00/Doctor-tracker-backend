// Builds the filter/pagination shared by the doctors and patients list endpoints.
// Query params: q (text search), from/to (YYYY-MM-DD, inclusive), page, limit.
function buildListQuery(query) {
  const filter = {};
  if (query.q) filter.$text = { $search: query.q };
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) {
      const end = new Date(query.to);
      end.setUTCDate(end.getUTCDate() + 1);
      filter.createdAt.$lt = end;
    }
  }
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));
  return { filter, page, limit, skip: (page - 1) * limit };
}

module.exports = { buildListQuery };
