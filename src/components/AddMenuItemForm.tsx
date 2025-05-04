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
    <Container
      fluid
      className="align-items-center justify-content-center py-3"
      style={{
        minHeight: '100vh',
        backgroundImage:
          "url('https://www.hawaii.edu/wp/wp-content/uploads/2021/04/Manoa4.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }}
    
    >
      <Row className="mt-4 pb-4 justify-content-center">
        <Col xs={8}>
          <Card className="p-4 shadow-sm rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <Card.Body>
            <h2 className="text-center">Add Menu Item</h2>
              <Form onSubmit={formHandleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Name</strong></Form.Label>
                  <Form.Control
                    type="text"
                    {...register('name')}
                    className={errors.name ? 'is-invalid' : ''}
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><strong>Description</strong></Form.Label>
                  <Form.Control
                    as="textarea"
                    {...register('description')}
                    className={errors.description ? 'is-invalid' : ''}
                  />
                  <div className="invalid-feedback">{errors.description?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><strong>Price ($)</strong></Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    {...register('price')}
                    className={errors.price ? 'is-invalid' : ''}
                  />
                  <div className="invalid-feedback">{errors.price?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><strong>Category</strong></Form.Label>
                  <Form.Control
                    type="text"
                    {...register('category')}
                    className={errors.category ? 'is-invalid' : ''}
                    placeholder="e.g., Main Course, Dessert"
                  />
                  <div className="invalid-feedback">{errors.category?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><strong>Cuisine</strong></Form.Label>
                  <Form.Control
                    type="text"
                    {...register('cuisine')}
                    className={errors.cuisine ? 'is-invalid' : ''}
                    placeholder="e.g., Italian, Mexican"
                  />
                  <div className="invalid-feedback">{errors.cuisine?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><strong>Ingredients</strong></Form.Label>
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
                  <Form.Label><strong>Is this item offered only on special days?</strong></Form.Label>
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
                    <Form.Label><strong>Days Available (Special)</strong></Form.Label>
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

                <div className="d-flex justify-content-center mx-auto mt-2 gap-5">
                  <Button type="submit" variant="primary"
                    style={{ width: '150px' }}
                  >
                    Add Menu Item
                  </Button>
                  <Button href="/vendor" variant="secondary"
                    style={{ width: '150px' }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
