import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [layout("routes/layout.tsx", [
  index("routes/home.tsx"),
  route("services", "routes/services.tsx"),
  route("services/:serviceId", "routes/service-detail.tsx"),
  route("documents", "routes/documents.tsx"),
  route("education-records", "routes/education-records.tsx"),
  route("activity", "routes/activity.tsx"),
  route("payments", "routes/payments.tsx"),
  route("inbox", "routes/inbox.tsx"),
  route("profile", "routes/profile.tsx"),
  route("support", "routes/support.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("terms", "routes/terms.tsx"),
])] satisfies RouteConfig;
