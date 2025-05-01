/* eslint-disable react/prop-types */
// src/components/UserPreferencesForm.tsx

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  InputGroup,
  Collapse,
} from 'react-bootstrap';
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
  const displayName = session?.user?.email || 'User';

  const [showForm, setShowForm] = useState(false);

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
    <Container className="py-4">
      {/* Greeting */}
      <Row className="justify-content-center mb-3 text-center">
        <Col xs="auto">
          <h4>
            Welcome,
            {displayName}
            !
          </h4>
          <p className="text-muted">Customize your food experience below.</p>
        </Col>
      </Row>

      {/* Tutorial */}
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="mb-4">
            <Card.Body>
              <h5>How This Page Works</h5>
              <ul className="mb-0">
                <li>✔️ Add your favorite cuisines under &quot;Food Preferences&quot;</li>
                <li>❌ List ingredients you&apos;d like to avoid under &quot;Food Aversions&quot;</li>
                <li> Your top picks will be based on these choices</li>
                <li> You can update these at any time</li>
              </ul>
            </Card.Body>
          </Card>

          {/* Summary */}
          <Card className="mb-4">
            <Card.Body>
              <h5>Current Preferences</h5>
              {initialData.foodPreferences.length > 0 ? (
                initialData.foodPreferences.map((pref, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <span key={i} className="badge bg-success me-2 mb-1">{pref}</span>
                ))
              ) : (
                <p className="text-muted">No preferences set yet.</p>
              )}

              <h5 className="mt-4">Current Aversions</h5>
              {initialData.foodAversions.length > 0 ? (
                initialData.foodAversions.map((av, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <span key={i} className="badge bg-danger me-2 mb-1">{av}</span>
                ))
              ) : (
                <p className="text-muted">No aversions set yet.</p>
              )}
            </Card.Body>
          </Card>

          {/* Toggle Form Button */}
          <Button
            variant={showForm ? 'outline-secondary' : 'primary'}
            onClick={() => setShowForm(!showForm)}
            aria-controls="preferences-form-collapse"
            aria-expanded={showForm}
            className="mb-3"
          >
            {showForm ? 'Hide Form' : '✏️ Edit Preferences'}
          </Button>

          {/* Collapsible Form */}
          <Collapse in={showForm}>
            <div id="preferences-form-collapse">
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
                    </Form.Group>

                    <Form.Group className="mt-3">
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
                    </Form.Group>

                    <Form.Group className="form-group pt-3">
                      <Button type="submit" variant="primary">
                        Save Preferences
                      </Button>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </Collapse>
        </Col>
      </Row>
    </Container>
  );
};

export default UserPreferencesForm;
