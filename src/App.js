import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const options = [
        { value: 'alphabets', label: 'Alphabets' },
        { value: 'numbers', label: 'Numbers' },
        { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' }
    ];

    const handleSubmit = async () => {
        try {
            setErrorMessage(''); // Reset error message

            // Ensure the input is a valid JSON string
            const validJson = JSON.parse(jsonInput);

            // Ensure the JSON is an array before sending it to the server
            if (!Array.isArray(validJson)) {
                throw new Error('The input must be a JSON array.');
            }

            // Send the request to the backend
            const res = await axios.post('http://localhost:3001/bfhl', { data: validJson });
            setResponse(res.data);
        } catch (error) {
            console.error('Error:', error.message);
            setErrorMessage(`Error: ${error.message}`);
        }
    };

    const renderResponse = () => {
        if (!response) return null;

        return (
            <Card className="mt-4">
                <Card.Body>
                    {selectedOptions.includes('alphabets') && (
                        <p><strong>Alphabets:</strong> {response.alphabets.join(', ')}</p>
                    )}
                    {selectedOptions.includes('numbers') && (
                        <p><strong>Numbers:</strong> {response.numbers.join(', ')}</p>
                    )}
                    {selectedOptions.includes('highest_lowercase_alphabet') && (
                        <p><strong>Highest Lowercase Alphabet:</strong> {response.highest_lowercase_alphabet.join(', ')}</p>
                    )}
                </Card.Body>
            </Card>
        );
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <h1 className="text-center mt-5">21BHI10024 JSON Processor</h1>
                    <Card className="mt-4 p-4 shadow-sm">
                        <Form>
                            <Form.Group controlId="jsonInput">
                                <Form.Label>Enter JSON Array</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    value={jsonInput}
                                    onChange={(e) => setJsonInput(e.target.value)}
                                    placeholder='e.g., ["a", "b", "1", "2"]'
                                />
                            </Form.Group>

                            <Button variant="primary" className="mt-3" onClick={handleSubmit} block>
                                Submit
                            </Button>
                        </Form>

                        <div className="mt-3">
                            <Select
                                isMulti
                                options={options}
                                onChange={(selected) => setSelectedOptions(selected.map(option => option.value))}
                            />
                        </div>

                        {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
                        {renderResponse()}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default App;
