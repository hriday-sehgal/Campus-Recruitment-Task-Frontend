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
    const [isJsonValid, setIsJsonValid] = useState(false);

    // Options for the multi-select dropdown
    const options = [
        { value: 'alphabets', label: 'Alphabets' },
        { value: 'numbers', label: 'Numbers' },
        { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' }
    ];

    // Handle JSON input change and validate
    const handleInputChange = (e) => {
        setJsonInput(e.target.value);

        try {
            // Validate JSON format
            const parsedJson = JSON.parse(e.target.value);
            if (parsedJson && parsedJson.data && Array.isArray(parsedJson.data)) {
                setIsJsonValid(true);
                setErrorMessage('');
            } else {
                setIsJsonValid(false);
                setErrorMessage('The input must be a JSON object with a "data" array.');
            }
        } catch (error) {
            setIsJsonValid(false);
            setErrorMessage('Invalid JSON format.');
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!isJsonValid) {
            setErrorMessage('Please enter a valid JSON before submitting.');
            return;
        }

        try {
            setErrorMessage(''); // Reset error message

            // Send the request to the backend
            const res = await axios.post('https://bajaj-finserv-health-backend-task.onrender.com/bfhl', {
                data: JSON.parse(jsonInput).data
            });

            if (res.data.is_success) {
                setResponse(res.data);
            } else {
                setErrorMessage('Error processing request.');
            }
        } catch (error) {
            console.error('Error:', error.message);
            setErrorMessage(`Error: ${error.message}`);
        }
    };

    // Render the response based on selected options
    const renderResponse = () => {
        if (!response) return null;

        return (
            <Card className="mt-4">
                <Card.Body>
                    {selectedOptions.includes('alphabets') && response.alphabets && response.alphabets.length > 0 && (
                        <p><strong>Alphabets:</strong> {response.alphabets.join(', ')}</p>
                    )}
                    {selectedOptions.includes('numbers') && response.numbers && response.numbers.length > 0 && (
                        <p><strong>Numbers:</strong> {response.numbers.join(', ')}</p>
                    )}
                    {selectedOptions.includes('highest_lowercase_alphabet') && response.highest_lowercase_alphabet && response.highest_lowercase_alphabet.length > 0 && (
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
                                    onChange={handleInputChange}
                                    placeholder='e.g., { "data": ["M", "1", "334", "4", "B", "Z", "a"] }'
                                />
                            </Form.Group>

                            <Button variant="primary" className="mt-3" onClick={handleSubmit} block>
                                Submit
                            </Button>
                        </Form>

                        {isJsonValid && (
                            <div className="mt-3">
                                <Select
                                    isMulti
                                    options={options}
                                    onChange={(selected) => setSelectedOptions(selected.map(option => option.value))}
                                />
                            </div>
                        )}

                        {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
                        {renderResponse()}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default App;
