import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Card, Button } from "@/components";
import DynamicFieldArray from "@/components/form/DynamicFieldArray";
import FormRowVertical from "@/components/form/FormRowVertical";
import Input from "@/components/form/Input";
import type { ProductFormValues } from "../../validation/product.validation";

type Specification = {
  key: string;
  value: string;
};

const DEFAULT_SPEC: Specification = {
  key: "",
  value: "",
};

const JSON_PLACEHOLDER = `{
  "dialColor": "Black",
  "strapMaterial": "Leather",
  "movementType": "Automatic",
  "crystal": "Sapphire"
}`;

function parseSpecificationsJson(text: string): Specification[] {
  const trimmed = text.trim();

  if (!trimmed) {
    throw new Error("Paste a JSON object to import specifications.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error(
      'Invalid JSON. Use a flat object like {"dialColor": "Black"}.'
    );
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("JSON must be a flat object of key-value pairs.");
  }

  return Object.entries(parsed as Record<string, unknown>)
    .filter(([key]) => key.trim())
    .map(([key, value]) => ({
      key: key.trim(),
      value: value == null ? "" : String(value),
    }));
}

export default function SpecificationsSection() {
  const { setValue } = useFormContext<ProductFormValues>();

  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");

  const applySpecificationsFromJson = (text: string) => {
    try {
      const specifications = parseSpecificationsJson(text);

      setValue("specifications", specifications, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      setJsonError("");
    } catch (error) {
      setJsonError(
        error instanceof Error
          ? error.message
          : "Failed to parse specifications JSON."
      );
    }
  };

  const handleJsonPaste = (
    event: React.ClipboardEvent<HTMLTextAreaElement>
  ) => {
    const pastedText = event.clipboardData.getData("text");

    if (!pastedText.trim()) return;

    event.preventDefault();

    setJsonInput(pastedText);
    applySpecificationsFromJson(pastedText);
  };

  return (
    <Card
      title="Specifications"
      description="Add key/value specification pairs (e.g. Dial Color → Black)."
    >
      {/* JSON IMPORT */}
      <div className="mb-6 p-4 rounded border border-border bg-surface/50 space-y-3">
        <div>
          <h4 className="text-sm font-medium text-text-primary">
            Import from JSON
          </h4>

          <p className="text-xs text-text-muted mt-0.5">
            Paste a JSON object to automatically create specification
            key/value pairs.
          </p>
        </div>

        <textarea
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value);

            if (jsonError) {
              setJsonError("");
            }
          }}
          onPaste={handleJsonPaste}
          rows={5}
          placeholder={JSON_PLACEHOLDER}
          spellCheck={false}
          className="w-full px-3 py-2 rounded-md border border-border bg-surface text-text-primary placeholder:text-text-muted text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            Each JSON property becomes one key/value specification row.
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => applySpecificationsFromJson(jsonInput)}
          >
            Apply JSON
          </Button>
        </div>

        {jsonError ? (
          <p className="text-xs text-error">{jsonError}</p>
        ) : null}
      </div>

      {/* SPECIFICATION ROWS */}
      <DynamicFieldArray
        name="specifications"
        defaultItem={DEFAULT_SPEC}
        addLabel="Add specification"
        emptyMessage="No specifications yet. Add key/value pairs for this product."
        renderFields={(index) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormRowVertical
              label="Key"
              name={`specifications.${index}.key`}
              required
            >
              <Input
                name={`specifications.${index}.key`}
                placeholder="e.g. Dial Color"
              />
            </FormRowVertical>

            <FormRowVertical
              label="Value"
              name={`specifications.${index}.value`}
              required
            >
              <Input
                name={`specifications.${index}.value`}
                placeholder="e.g. Black"
              />
            </FormRowVertical>
          </div>
        )}
      />
    </Card>
  );
}