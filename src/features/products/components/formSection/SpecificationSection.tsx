import { TextInput } from "../../../../components/common/TextInput/TextInput";

interface Props {
  specification: any;
  setSpecification: (data: any) => void;
}

export function SpecificationSection({ specification, setSpecification }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Specifications</h2>

      <TextInput
        label="Description"
        value={specification.description}
        onChange={(v) => setSpecification({ ...specification, description: v })}
        placeholder="Enter specification description"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <TextInput
          label="Specification Image URL"
          value={specification.image}
          onChange={(v) => setSpecification({ ...specification, image: v })}
          placeholder="https://..."
        />
        <TextInput
          label="Specification Video URL"
          value={specification.video}
          onChange={(v) => setSpecification({ ...specification, video: v })}
          placeholder="https://..."
        />
        <TextInput
          label="Specification PDF URL"
          value={specification.pdf}
          onChange={(v) => setSpecification({ ...specification, pdf: v })}
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
