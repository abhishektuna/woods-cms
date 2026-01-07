import { TextInput } from "../../../../components/common/TextInput/TextInput";

interface Props {
  feature: any;
  setFeature: (data: any) => void;
}

export function FeatureSection({ feature, setFeature }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Features</h2>

      <TextInput
        label="Description"
        value={feature.description}
        onChange={(v) => setFeature({ ...feature, description: v })}
        placeholder="Enter feature description"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <TextInput
          label="Feature Image URL"
          value={feature.image}
          onChange={(v) => setFeature({ ...feature, image: v })}
          placeholder="https://..."
        />
        <TextInput
          label="Feature Video URL"
          value={feature.video}
          onChange={(v) => setFeature({ ...feature, video: v })}
          placeholder="https://..."
        />
        <TextInput
          label="Feature PDF URL"
          value={feature.pdf}
          onChange={(v) => setFeature({ ...feature, pdf: v })}
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
