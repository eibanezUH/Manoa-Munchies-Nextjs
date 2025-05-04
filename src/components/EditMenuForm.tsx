'use client';

import { useState, useTransition } from 'react';
import { Button, Card, Col, Container, Form, Row, InputGroup } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import swal from 'sweetalert';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { MenuItem } from '@prisma/client';
import { Trash } from 'react-bootstrap-icons';
import { EditMenuSchema } from '@/lib/validationSchemas';
import { editMenu, deleteMenuItem } from '@/lib/dbActions';

const EditMenuForm = ({ menuItem }: { menuItem: MenuItem }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(EditMenuSchema),
    defaultValues: {
      ...menuItem,
      ingredients: Array.isArray(menuItem.ingredients)
        ? menuItem.ingredients.map((value) => ({ value }))
        : (menuItem.ingredients as string).split(',').map((value) => ({ value })),

      specialDays: Array.isArray(menuItem.specialDays)
        ? menuItem.specialDays
        : (menuItem.specialDays as string).split(','),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    const updatedData = {
      ...data,
      ingredients: data.ingredients.map((i: any) => i.value),
      specialDays: data.specialDays,
    };
    await editMenu(updatedData);
    swal('Success', 'Your item has been updated', 'success', { timer: 2000 });
    setLoading(false);
  };

  const handleDelete = () => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, this item cannot be recovered!',
      icon: 'warning',
      buttons: ['Cancel', 'Delete'],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        startTransition(async () => {
          await deleteMenuItem(menuItem.id);
          swal('Deleted!', 'The menu item has been removed.', 'success');
          router.push('/vendor');
        });
      }
    });
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
    }}>
      <Row className="mt-4 pb-4 justify-content-center">
        <Col xs={8}>
          <Card className="p-4 shadow-sm rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <Card.Body>
              <h2 className="text-center">Edit Menu Item</h2>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register('id')} />
                <Form.Group className="mb-3">
                  <Form.Label><strong>Name</strong></Form.Label>
                  <Form.Control
                    type="text"
                    {...register('name')}
                    className={errors.name ? 'is-invalid' : ''}
                  />
                  <div className="invalid-feedback">{String(errors.name?.message || '')}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><strong>Description</strong></Form.Label>
                  <Form.Control
                    type="text"
                    {...register('description')}
                    className={errors.description ? 'is-invalid' : ''}
                  />
                  <div className="invalid-feedback">{String(errors.description?.message || '')}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><strong>Ingredients</strong></Form.Label>
                  {fields.map((field, index) => (
                    <InputGroup key={field.id} className="mb-2">
                      <Form.Control
                        {...register(`ingredients.${index}.value`)}
                        placeholder="Enter an ingredient"
                        className={(errors.ingredients as any)?.[index]?.value ? 'is-invalid' : ''}
                      />
                      <Button variant="danger" onClick={() => remove(index)}>
                        <Trash />
                      </Button>
                      <div className="invalid-feedback">
                        {((errors.ingredients as any)?.[index]?.value as any)?.message}
                      </div>
                    </InputGroup>
                  ))}
                  <Button variant="secondary" onClick={() => append({ value: '' })}>
                    Add Ingredient
                  </Button>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><strong>Special Days</strong></Form.Label>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <Form.Check
                      key={day}
                      type="checkbox"
                      label={day}
                      value={day}
                      {...register('specialDays')}
                      className="mb-2"
                    />
                  ))}
                </Form.Group>

                {/*<Row className="pt-3">
                  <Col>
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                  </Col>
                  <Col>
                    <Button type="button" onClick={() => reset()} variant="warning">
                      Reset
                    </Button>
                  </Col>
                </Row>*/}
              </Form>
              <div className="text-center d-flex justify-content-center mx-auto mt-2 gap-5">
                <Button
                  type="submit"
                  variant="success"
                  disabled={loading}
                  style={{ width: '100px' }}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
                <Button 
                  type="button" 
                  onClick={() => reset()} 
                  variant="warning" 
                  style={{ width: '100px' }}
                >
                  Reset
                </Button>
                <Button href="/vendor" variant="secondary"
                    style={{ width: '100px' }}
                >
                  Cancel
                </Button>
              </div>
              <hr />
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={isPending}
                className="text-center d-flex justify-content-center mx-auto mt-2"
                style={{ width: '200px' }}
              >
                {isPending ? 'Deleting...' : 'Delete Menu Item'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditMenuForm;
