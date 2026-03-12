"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import {
  createContext,
  FormEvent,
  forwardRef,
  JSX,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type IValue = string | number | any;
type IValues =
  | {
    [key: string]: IValue;
  }
  | any;
type IValidationSchema = { [x: string]: any };
type IErrors = { [x: string]: any };
type IToucheds = { [x: string]: any };

type IContextProps = {
  errors: IValues;
  values: IValues;
  initialValues: IValues;
  setErrors: (errors: IValues) => void;
  handleChange: (name: string, value: IValue) => void;
  handleSubmit: (e?: FormEvent<HTMLFormElement>) => Promise<IValues | null>;
  setFieldValue: (name: string, value: IValue) => void;
  setFieldValues: (values: IValues) => void;
  forceChanges: IValues;
};

const validate = (
  values: IValues,
  toucheds: IToucheds,
  validationSchema: IValidationSchema,
  callback: (errors: IErrors) => void,
) => {
  const data = serializeData(values);

  if (!validationSchema) {
    return;
  }

  validationSchema
    .validate(data, { abortEarly: false })
    .then((isValid: boolean) => {
      if (isValid) {
        callback({});
      }
    })
    .catch((err: IErrors) => {
      const errors = err.inner.reduce(
        (errors: IErrors, currentError: IErrors) => {
          const path = currentError.path.replace(/"/g, "");

          if (!toucheds[path]) {
            return errors;
          }

          return {
            ...errors,
            [path]: currentError.message,
          };
        },
        {},
      );

      callback(errors);
    });
};

const FormContext = createContext<IContextProps>({
  errors: {},
  values: {},
  forceChanges: {},
  initialValues: {},
  setErrors: () => null,
  handleChange: () => () => null,
  handleSubmit: (_e?: FormEvent<HTMLFormElement>) => Promise.resolve(null),
  setFieldValue: () => null,
  setFieldValues: () => null,
});

const deserializeObject = (
  payload: IValues,
  fieldName: string,
  value: IValue,
) => {
  return Object.keys(payload || {}).reduce((accumulator, key) => {
    let reduces = accumulator;

    if (Array.isArray(payload[key])) {
      reduces = payload[key].reduce((accumulator, iterator, index) => {
        let reduces = accumulator;

        if (typeof iterator === "object") {
          reduces = deserializeObject(iterator, `${key}[${index}].`, value);
        } else {
          reduces[`${fieldName}${key}[${index}]`] = iterator;
        }

        return reduces;
      }, reduces);
    } else if (typeof payload[key] === "object") {
      reduces = deserializeObject(payload[key], `${fieldName + key}.`, value);
    } else {
      reduces[fieldName + key] = payload[key];
    }

    return reduces;
  }, value);
};

const deserializeData = (data: IValues) => {
  return deserializeObject(data, "", {});
};

const serializeObject = (fields: string[], payload: IValues, value: IValue) => {
  const array = fields;
  const reduces = payload;

  const key = array.shift();
  if (!key) {
    return value;
  }

  if (key.indexOf("[") !== -1) {
    const field = key.split("[")[0];

    if (!field) {
      return reduces;
    }

    const index = parseInt(`${key.split("[")[1]?.replace("]", "")}`, 10);

    if (!reduces[field]) {
      reduces[field] = [];
    }
    if (!reduces[field][index]) {
      reduces[field][index] = {};
    }
    reduces[field][index] = serializeObject(
      array,
      reduces[field][index],
      value,
    );

    return reduces;
  }

  if (array.length > 0) {
    reduces[key] = serializeObject(array, reduces[key] || {}, value);
  } else {
    reduces[key] = value;
  }

  return reduces;
};

const serializeData = (data: IValues) => {
  return Object.keys(data || {}).reduce((accumulator, fieldName) => {
    let reduces = accumulator;
    const array = fieldName.split(".");

    reduces = serializeObject(array, reduces, data[fieldName]);

    return reduces;
  }, {}) as IValues;
};

export function useDebouncedState<T = IValues>(
  defaultValue: T,
  wait: number,
  options = { leading: false },
) {
  const [value, setValue] = useState(defaultValue);
  const timeoutRef = useRef<number | null>(null);
  const leadingRef = useRef(true);

  const clearTimeout = () => window.clearTimeout(timeoutRef.current!);
  useEffect(() => clearTimeout, []);

  const debouncedSetValue = useCallback(
    (newValue: SetStateAction<T>) => {
      clearTimeout();
      if (leadingRef.current && options.leading) {
        setValue(newValue);
      } else {
        timeoutRef.current = window.setTimeout(() => {
          leadingRef.current = true;
          setValue(newValue);
        }, wait);
      }
      leadingRef.current = false;
    },
    [options.leading],
  );

  return [value, debouncedSetValue] as const;
}

export const useField = (name: string, isArray = false) => {
  const { handleChange, errors, initialValues, forceChanges } =
    useContext(FormContext);
  const [value, setValue] = useState<IValue>(
    isArray ? serializeData(initialValues)[name] : initialValues[name],
  );

  const onChange = (value: IValue) => {
    setValue(value);
    handleChange(name, value);
  };

  useEffect(() => {
    if (forceChanges[name] && value !== forceChanges[name]) {
      setValue(forceChanges[name]);
    }
  }, [forceChanges]);

  return {
    value,
    error: errors[name],
    onChange,
  };
};

export const Field = ({
  name,
  children,
}: {
  name: string;
  children: ({
    value,
    onChange,
    error,
  }: {
    value: IValue;
    onChange: (value: IValue) => void;
    error: string;
  }) => JSX.Element;
}) => {
  const { handleChange, errors, initialValues } = useContext(FormContext);
  const [value, setValue] = useState(initialValues[name]);

  const onChange = (value: IValue) => {
    setValue(value);
    handleChange(name, value);
  };

  return children({ value, onChange, error: errors[name] });
};

export type IFormRef = {
  submit: () => void;
  validate: () => Promise<IErrors>;
  getValues: () => IValues;
  setErrors: (errors: IErrors) => void;
  setFieldValue: (name: string, value: IValue) => void;
  setFieldValues: (values: IValues) => void;
};

type Props = {
  initialValues: IValues;
  validationSchema?: IValidationSchema;
  onSubmit?: (values: IValues) => void;
  children: (props: {
    values: IValues;
    errors: IErrors;
    setFieldValue: (name: string, value: IValue) => void;
    setFieldValues: (values: IValues) => void;
    setErrors: (errors: IErrors) => void;
    handleSubmit: (e?: FormEvent<HTMLFormElement>) => Promise<IValues | null>;
  }) => JSX.Element;
};

const Form = forwardRef(
  (
    {
      initialValues: _initialValues,
      validationSchema,
      onSubmit,
      children,
    }: Props,
    ref: React.Ref<IFormRef>,
  ) => {
    const formRef = useRef<HTMLFormElement>(null);
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const [initialValues, setInitialValues] = useDebouncedState<IValues>(
      deserializeData(_initialValues),
      50,
    );
    const [forceChanges, setForceChanges] = useState<IValues>({});
    const [errors, setErrors] = useDebouncedState({}, 50);
    const [, setSubmitted] = useState(false);

    const getValues = () => {
      if (!formRef?.current) return initialValues;

      const formData = new FormData(formRef?.current);
      const fieldValues = Object.fromEntries(formData.entries());

      const typeValue = (value: string) => {
        if (value === "") return undefined;

        if (value === "true") {
          return true;
        }

        if (value === "false") {
          return false;
        }

        // const isNumeric = (value: string) => {
        //   return /^-?\d+$/.test(value);
        // };

        // if (isNumeric(value)) {
        //   const intValue = parseInt(value, 10);
        //   const floatValue = parseFloat(value);

        //   return intValue === floatValue ? intValue : floatValue;
        // }

        return value;
      };

      const values = Object.keys(fieldValues).reduce((acc, iter) => {
        return {
          ...acc,
          [iter]: typeValue(fieldValues[iter] as string),
        };
      }, {});

      return values;
    };

    useEffect(() => {
      const form = formRef.current;
      if (!form) return;

      const handleAutofill = () => {
        const formData = new FormData(form);
        const values = Object.fromEntries(formData.entries());
        const currentValues = { ...getValues(), ...values };
        const touchedFields: IToucheds = {};

        Object.keys(values).forEach((key) => {
          if (values[key]) {
            touchedFields[key] = true;
          }
        });

        // Update values first
        setInitialValues(deserializeData(currentValues));

        // Then validate all fields
        if (validationSchema && Object.keys(touchedFields).length > 0) {
          validate(
            currentValues,
            touchedFields,
            validationSchema,
            (fieldErrors) => {
              setErrors(fieldErrors);
            },
          );
        }
      };

      form.addEventListener("change", handleAutofill);
      return () => form.removeEventListener("change", handleAutofill);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [validationSchema]);

    useImperativeHandle(ref, () => ({
      submit() {
        return handleSubmit();
      },
      validate() {
        return new Promise((resolve) => {
          setSubmitted(true);

          const values = getValues();

          const touched = Object.keys(values).reduce(
            (acc, iter) => ({
              ...acc,
              [iter]: true,
            }),
            {},
          );

          validate(getValues(), touched, validationSchema || {}, (errors) => {
            setErrors(errors);

            resolve(errors || {});
          });
        });
      },
      getValues,
      setFieldValue,
      setFieldValues,
      setErrors,
    }));

    const handleSubmit = (
      e?: FormEvent<HTMLFormElement>,
    ): Promise<IValues | null> => {
      e?.preventDefault();

      const values = getValues();
      const data = serializeData(values);

      setSubmitted(true);

      const touched = Object.keys(values || {}).reduce(
        (acc, iter) => ({
          ...acc,
          [iter]: true,
        }),
        {},
      );

      return new Promise((resolve) => {
        if (validationSchema) {
          validate(values, touched, validationSchema, (errors) => {
            setErrors(errors);

            if (onSubmit && Object.keys(errors || {}).length === 0) {
              onSubmit(data);
            }

            if (Object.keys(errors || {}).length === 0) {
              resolve(data);
            } else {
              resolve(null);
            }
          });
        } else if (onSubmit) {
          onSubmit(data);
          resolve(data);
        }
      });
    };

    const handleChange = (name: string, value: IValue) => {
      const values = getValues();
      const deserialize = deserializeData({ [name]: value });

      const formData = new FormData(formRef?.current || undefined);

      Object.keys(values).forEach((key) => {
        if (
          key === name ||
          key.indexOf(`${name}.`) !== -1 ||
          key.indexOf(`${name}[`) !== -1
        ) {
          delete values[key];
          formData.delete(key);
        }
      });

      setInitialValues((prevValues: IValues) => ({
        ...prevValues,
        ...deserialize,
      }));

      validate(
        { [name]: value },
        { [name]: true },
        validationSchema || {},
        (errors) => {
          setErrors((state) => ({ ...state, [name]: errors[name] }));
        },
      );
    };

    const setFieldValue = (name: string, value: IValue) => {
      setInitialValues((prevValues: IValues) => {
        const values = deserializeData({
          ...serializeData(prevValues),
          [name]: value,
        });

        const formData = new FormData(formRef?.current || undefined);

        Object.keys(values).forEach((key) => {
          formData.delete(key);
        });

        setForceChanges((prev: IValues) => ({
          ...prev,
          [name]: value,
        }));

        validate(
          { [name]: value },
          { [name]: true },
          validationSchema || {},
          (errors) => {
            setErrors((state) => ({ ...state, [name]: errors[name] }));
          },
        );

        return values;
      });
    };

    const setFieldValues = (_values: IValues) => {
      setInitialValues((prevValues: IValues) => {
        const values = deserializeData({
          ...serializeData(prevValues),
          ..._values,
        });

        const formData = new FormData(formRef?.current || undefined);

        Object.keys(values).forEach((key) => {
          formData.delete(key);
        });

        setForceChanges((prev: IValues) => ({
          ...prev,
          ..._values,
        }));

        return values;
      });
    };

    return (
      <FormContext.Provider
        value={{
          errors,
          values: initialValues,
          setErrors,
          setFieldValue,
          setFieldValues,
          handleChange,
          handleSubmit,
          initialValues,
          forceChanges,
        }}
      >
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          {Object.keys(initialValues).map((key) => {
            return (
              <input
                key={key}
                ref={(el) => {
                  inputRefs.current[key] = el;
                }}
                type="hidden"
                name={key}
                value={`${initialValues[key] !== undefined ? initialValues[key] : ""
                  }`}
              />
            );
          })}

          {children({
            values: serializeData(initialValues),
            errors,
            setErrors,
            setFieldValue,
            setFieldValues,
            handleSubmit,
          })}
        </form>
      </FormContext.Provider>
    );
  },
);

Form.displayName = "Form";

export { Form };
