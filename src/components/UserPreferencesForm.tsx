/* eslint-disable react/prop-types */
// src/components/UserPreferencesForm.tsx

'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row, InputGroup } from 'react-bootstrap';
import { useForm, useFieldArray, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { UserPreferencesSchema } from '@/lib/validationSchemas';
import { upsertUserProfile } from '@/lib/dbActions';
import { Trash } from 'react-bootstrap-icons';

type FormData = {
  foodPreferences: { value: string }[];
  foodAversions: { value: string }[];
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
    resolver: yupResolver(UserPreferencesSchema) as Resolver<FormData>,
    defaultValues: {
      foodPreferences: initialData.foodPreferences.map((p) => ({ value: p })),
      foodAversions: initialData.foodAversions.map((a) => ({ value: a })),
    },
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
        data.foodPreferences.map((p) => p.value),
        data.foodAversions.map((a) => a.value),
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
                        {...register(`foodPreferences.${index}.value`)}
                        placeholder="Enter a preference"
                        className={errors.foodPreferences?.[index]?.value ? 'is-invalid' : ''}
                      />
                      <Button variant="danger" onClick={() => removePreference(index)}>
                        <Trash />
                      </Button>
                      <div className="invalid-feedback">
                        {errors.foodPreferences?.[index]?.value?.message}
                      </div>
                    </InputGroup>
                  ))}
                  <Button
                    variant="secondary"
                    onClick={() => appendPreference({ value: '' })}
                    className="mb-2"
                  >
                    Add Preference
                  </Button>
                  {errors.foodPreferences && (
                    <div className="invalid-feedback d-block">
                      {typeof errors.foodPreferences.message === 'string'
                        ? errors.foodPreferences.message
                        : 'At least one preference is required'}
                    </div>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Food Aversions</Form.Label>
                  {aversionFields.map((field, index) => (
                    <InputGroup key={field.id} className="mb-2">
                      <Form.Control
                        {...register(`foodAversions.${index}.value`)}
                        placeholder="Enter an aversion"
                        className={errors.foodAversions?.[index]?.value ? 'is-invalid' : ''}
                      />
                      <Button variant="danger" onClick={() => removeAversion(index)}>
                        <Trash />
                      </Button>
                      <div className="invalid-feedback">
                        {errors.foodAversions?.[index]?.value?.message}
                      </div>
                    </InputGroup>
                  ))}
                  <Button
                    variant="secondary"
                    onClick={() => appendAversion({ value: '' })}
                    className="mb-2"
                  >
                    Add Aversion
                  </Button>
                  {errors.foodAversions && (
                    <div className="invalid-feedback d-block">
                      {typeof errors.foodAversions.message === 'string'
                        ? errors.foodAversions.message
                        : 'At least one aversion is required'}
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
