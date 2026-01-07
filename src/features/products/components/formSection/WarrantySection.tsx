import { TextInput } from "../../../../components/common/TextInput/TextInput";

interface Props {
  warranty: any;
  setWarranty: (data: any) => void;
}

export function WarrantySection({ warranty, setWarranty }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Warranty</h2>

      <TextInput
        label="Title"
        value={warranty.title}
        onChange={(v) => setWarranty({ ...warranty, title: v })}
        placeholder="Enter warranty title"
      />

      <TextInput
        label="Description"
        value={warranty.description}
        onChange={(v) => setWarranty({ ...warranty, description: v })}
        placeholder="Enter warranty details"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <TextInput
          label="Warranty Image URL"
          value={warranty.image}
          onChange={(v) => setWarranty({ ...warranty, image: v })}
          placeholder="https://..."
        />
        <TextInput
          label="Warranty Video URL"
          value={warranty.video}
          onChange={(v) => setWarranty({ ...warranty, video: v })}
          placeholder="https://..."
        />
        <TextInput
          label="Warranty PDF URL"
          value={warranty.pdf}
          onChange={(v) => setWarranty({ ...warranty, pdf: v })}
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
