'use client';

import { Button, Card, Col, Container, Form, Row, InputGroup } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Trash } from 'react-bootstrap-icons';

type FormData = {
  name: string;
  description?: string;
  price: number;
  category: string;
  cuisine: string;
  ingredients: string[];
};

type MenuItemFormProps = {
  handleSubmit: (formData: FormData) => Promise<void>;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().nullable(),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  category: Yup.string().required('Category is required'),
  cuisine: Yup.string().required('Cuisine is required'),
  ingredients: Yup.array()
    .of(Yup.string().required('Ingredient cannot be empty'))
    .min(1, 'At least one ingredient is required'),
});

export default function MenuItemForm({ handleSubmit }: MenuItemFormProps) {
  const {
    register,
    control,
    handleSubmit: formHandleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      cuisine: '',
      ingredients: [''],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
    formData.append('cuisine', data.cuisine);
    formData.append('ingredients', data.ingredients.join(','));
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
                        {...register(`ingredients.${index}`)}
                        placeholder="Enter an ingredient"
                        className={errors.ingredients?.[index] ? 'is-invalid' : ''}
                      />
                      <Button variant="danger" onClick={() => remove(index)}>
                        <Trash />
                      </Button>
                      <div className="invalid-feedback">
                        {errors.ingredients?.[index]?.message}
                      </div>
                    </InputGroup>
                  ))}
                  <Button variant="secondary" onClick={() => append('')}>
                    Add Ingredient
                  </Button>
                  {errors.ingredients && (
                    <div className="invalid-feedback d-block">
                      {errors.ingredients.message}
                    </div>
                  )}
                </Form.Group>

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
