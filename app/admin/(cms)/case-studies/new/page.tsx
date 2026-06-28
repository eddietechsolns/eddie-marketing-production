import CaseStudyForm from "@/components/admin/forms/CaseStudyForm";

export const dynamic = "force-dynamic";

export default function NewCaseStudyPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">New Case Study</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Create a new case study to showcase your results.
        </p>
      </div>
      <CaseStudyForm />
    </div>
  );
}
