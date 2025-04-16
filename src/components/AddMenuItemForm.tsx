'use client';

import { Button, Card, Col, Container, Form, Row, InputGroup } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Trash } from 'react-bootstrap-icons';
import { AddMenuItemSchema, AddMenuItemFormData } from '@/lib/validationSchemas';

type MenuItemFormProps = {
  handleSubmit: (formData: globalThis.FormData) => Promise<void>;
};

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function MenuItemForm({ handleSubmit }: MenuItemFormProps) {
  const {
    register,
    control,
    watch,
    handleSubmit: formHandleSubmit,
    formState: { errors },
  } = useForm<AddMenuItemFormData>({
    resolver: yupResolver<AddMenuItemFormData>(AddMenuItemSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      cuisine: '',
      ingredients: [{ value: '' }],
      isSpecial: false,
      specialDays: [],
    },
  });

  const { fields, append, remove } = useFieldArray<AddMenuItemFormData>({
    control,
    name: 'ingredients',
  });

  const isSpecial = watch('isSpecial'); // Watch the toggle state
  const selectedDays = watch('specialDays') || []; // Watch the selected days

  const onSubmit = async (data: AddMenuItemFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
    formData.append('cuisine', data.cuisine);
    const validIngredients = data.ingredients
      .map((ingredient) => ingredient.value)
      .filter((value) => value.trim() !== '');
    formData.append('ingredients', validIngredients.join(','));
    formData.append('isSpecial', data.isSpecial.toString());
    formData.append('specialDays', data.specialDays.join(','));
    await handleSubmit(formData);
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={8}>
          <Card>
            <Card.Body>
              <h2>Add Menu Item</h2>
              <Form onSubmit={formHandleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('name')}
                    className={errors.name ? 'is-invalid' : ''}
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    {...register('description')}
                    className={errors.description ? 'is-invalid' : ''}
                  />
                  <div className="invalid-feedback">{errors.description?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    {...register('price')}
                    className={errors.price ? 'is-invalid' : ''}
                  />
                  <div className="invalid-feedback">{errors.price?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('category')}
                    className={errors.category ? 'is-invalid' : ''}
                    placeholder="e.g., Main Course, Dessert"
                  />
                  <div className="invalid-feedback">{errors.category?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Cuisine</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('cuisine')}
                    className={errors.cuisine ? 'is-invalid' : ''}
                    placeholder="e.g., Italian, Mexican"
                  />
                  <div className="invalid-feedback">{errors.cuisine?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Ingredients</Form.Label>
                  {fields.map((field, index) => (
                    <InputGroup key={field.id} className="mb-2">
                      <Form.Control
                        {...register(`ingredients.${index}.value`)}
                        placeholder="Enter an ingredient"
                        className={errors.ingredients?.[index]?.value ? 'is-invalid' : ''}
                      />
                      <Button variant="danger" onClick={() => remove(index)}>
                        <Trash />
                      </Button>
                      <div className="invalid-feedback">
                        {errors.ingredients?.[index]?.value?.message}
                      </div>
                    </InputGroup>
                  ))}
                  <Button variant="secondary" onClick={() => append({ value: '' })}>
                    Add Ingredient
                  </Button>
                  {errors.ingredients && (
                    <div className="invalid-feedback d-block">
                      {typeof errors.ingredients.message === 'string'
                        ? errors.ingredients.message
                        : 'At least one ingredient is required'}
                    </div>
                  )}
                </Form.Group>

                {/* Toggle for Is Special */}
                <Form.Group className="mb-3">
                  <Form.Label>Is this a special?</Form.Label>
                  <Form.Check
                    type="switch"
                    {...register('isSpecial')}
                    label={isSpecial ? 'Yes' : 'No'}
                  />
                  <div className="invalid-feedback">{errors.isSpecial?.message}</div>
                </Form.Group>

                {/* Checkboxes for Special Days, shown only if isSpecial is true */}
                {isSpecial && (
                  <Form.Group className="mb-3">
                    <Form.Label>Days Available (Special)</Form.Label>
                    <div>
                      {daysOfWeek.map((day) => (
                        <Form.Check
                          key={day}
                          type="checkbox"
                          label={day}
                          value={day}
                          {...register('specialDays')}
                          className="mb-2"
                        />
                      ))}
                    </div>
                    {selectedDays.length > 0 && (
                      <div className="mt-2">
                        <strong>Selected Days:</strong>
                        {' '}
                        {selectedDays.join(', ')}
                      </div>
                    )}
                    {errors.specialDays && (
                      <div className="invalid-feedback d-block">
                        {typeof errors.specialDays.message === 'string'
                          ? errors.specialDays.message
                          : 'Please select at least one day'}
                      </div>
                    )}
                  </Form.Group>
                )}

                <Button type="submit" variant="primary">
                  Add Menu Item
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
