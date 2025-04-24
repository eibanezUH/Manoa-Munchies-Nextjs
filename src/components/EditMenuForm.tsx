'use client';

import { useState, useTransition } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { MenuItem } from '@prisma/client';
import { EditMenuSchema } from '@/lib/validationSchemas';
import { editMenu, deleteMenuItem } from '@/lib/dbActions';

const EditMenuForm = ({ menuItem }: { menuItem: MenuItem }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MenuItem>({
    resolver: yupResolver(EditMenuSchema),
    defaultValues: menuItem,
  });

  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = async (data: MenuItem) => {
    setLoading(true);
    await editMenu(data);
    swal('Success', 'Your item has been updated', 'success', {
      timer: 2000,
    });
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
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={10}>
          <Col className="text-center">
            <h2>Edit MenuItem</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register('id')} />
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Restaurant Name</Form.Label>
                      <input
                        type="text"
                        {...register('name')}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.name?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Description</Form.Label>
                      <input
                        type="text"
                        {...register('description')}
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.description?.message}</div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Ingredients</Form.Label>
                      <input
                        type="text"
                        {...register('ingredients')}
                        className={`form-control ${errors.ingredients ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.ingredients?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        type="button"
                        onClick={() => reset(menuItem)}
                        variant="warning"
                        className="float-right"
                      >
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
              <hr />
              <div className="text-center">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  {isPending ? 'Deleting...' : 'Delete Menu Item'}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditMenuForm;
