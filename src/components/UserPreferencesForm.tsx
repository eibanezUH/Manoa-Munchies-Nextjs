// src/components/UserPreferencesForm.tsx
'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row, InputGroup } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { UserPreferencesSchema } from '@/lib/validationSchemas';
import { upsertUserProfile } from '@/lib/dbActions';
import { Trash } from 'react-bootstrap-icons';

type FormData = {
  foodPreferences: string[];
  foodAversions: string[];
};

interface UserPreferencesFormProps {
  initialData: {
    foodPreferences: string[];
    foodAversions: string[];
  };
}

const UserPreferencesForm: React.FC<UserPreferencesFormProps> = ({ initialData }) => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email || '';

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(UserPreferencesSchema),
    defaultValues: initialData,
  });

  const { fields: preferenceFields, append: appendPreference, remove: removePreference } = useFieldArray({
    control,
    name: 'foodPreferences',
  });

  const { fields: aversionFields, append: appendAversion, remove: removeAversion } = useFieldArray({
    control,
    name: 'foodAversions',
  });

  const onSubmit = async (data: FormData) => {
    try {
      await upsertUserProfile(
        currentUser,
        data.foodPreferences,
        data.foodAversions
      );
      swal('Success', 'Preferences updated!', 'success', { timer: 2000 });
    } catch (error) {
      swal('Error', 'Failed to update preferences', 'error');
    }
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                  <Form.Label>Food Preferences</Form.Label>
                  {preferenceFields.map((field, index) => (
                    <InputGroup key={field.id} className="mb-2">
                      <Form.Control
                        {...register(`foodPreferences.${index}`)}
                        placeholder="Enter a preference"
                        className={errors.foodPreferences?.[index] ? 'is-invalid' : ''}
                      />
                      <Button
                        variant="danger"
                        onClick={() => removePreference(index)}
                      >
                        <Trash />
                      </Button>
                      <div className="invalid-feedback">
                        {errors.foodPreferences?.[index]?.message}
                      </div>
                    </InputGroup>
                  ))}
                  <Button
                    variant="secondary"
                    onClick={() => appendPreference('')}
                    className="mb-2"
                  >
                    Add Preference
                  </Button>
                  {errors.foodPreferences && (
                    <div className="invalid-feedback d-block">
                      {errors.foodPreferences.message || 'At least one preference is required'}
                    </div>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Food Aversions</Form.Label>
                  {aversionFields.map((field, index) => (
                    <InputGroup key={field.id} className="mb-2">
                      <Form.Control
                        {...register(`foodAversions.${index}`)}
                        placeholder="Enter an aversion"
                        className={errors.foodAversions?.[index] ? 'is-invalid' : ''}
                      />
                      <Button
                        variant="danger"
                        onClick={() => removeAversion(index)}
                      >
                        <Trash />
                      </Button>
                      <div className="invalid-feedback">
                        {errors.foodAversions?.[index]?.message}
                      </div>
                    </InputGroup>
                  ))}
                  <Button
                    variant="secondary"
                    onClick={() => appendAversion('')}
                    className="mb-2"
                  >
                    Add Aversion
                  </Button>
                  {errors.foodAversions && (
                    <div className="invalid-feedback d-block">
                      {errors.foodAversions.message}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary">
                        Save Preferences
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserPreferencesForm;