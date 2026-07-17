import { Card } from '@/components';
import FormRowVertical from '@/components/form/FormRowVertical';
import Input from '@/components/form/Input';
import Textarea from '@/components/form/Textarea';

const ProductMainSection = () => {
  return (
    <>
      <Card title="Basic info">
        <div className="space-y-4">
          <FormRowVertical label="Title" name="title" required>
            <Input name="title" placeholder="Enter product title" />
          </FormRowVertical>

          <FormRowVertical label="Slug" name="slug" required>
            <Input name="slug" placeholder="e.g. luxury-watches" />
          </FormRowVertical>
        </div>
      </Card>

      <Card title="Description">
        <FormRowVertical label="Description" name="description" required>
          <Textarea
            name="description"
            rows={8}
            placeholder="Enter product description"
          />
        </FormRowVertical>
      </Card>
    </>
  );
};

export default ProductMainSection;
