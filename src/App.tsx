import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  HStack,
  useToast,
  Text,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Switch,
  FormHelperText,
  Tooltip,
  Radio,
  RadioGroup,
} from '@chakra-ui/react'
import { InfoIcon, CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons'

interface ListingFormData {
  itemName: string
  grade: string
  ean: string
  mpn: string
  rrp: string
  useLargeModel: boolean
}

const App: React.FC = () => {
  const [formData, setFormData] = useState<ListingFormData>({
    itemName: '',
    grade: 'A',
    ean: '',
    mpn: '',
    rrp: '',
    useLargeModel: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const [generatedListing, setGeneratedListing] = useState<string>('')
  const toast = useToast()

  // eBay brand colors
  const ebayBlue = "#0066C0"
  const ebayDarkBlue = "#003087"
  const ebayYellow = "#FF9900"
  const ebayGray = "#333333"

  const getConditionDescription = (grade: string) => {
    const conditions = {
      'A': 'Mint/New',
      'B': 'Good Condition with Light Wear',
      'C': 'Used',
      'F': 'Non-Working'
    }
    return conditions[grade as keyof typeof conditions] || 'Used'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Get condition description and modify item name
      const condition = getConditionDescription(formData.grade)
      const modifiedItemName = `${condition} ${formData.itemName}`

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      console.log('Using API URL:', apiUrl) // Debug log

      const response = await fetch(`${apiUrl}/api/generate-listing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          itemName: modifiedItemName,
          grade: formData.grade,
          ean: formData.ean,
          mpn: formData.mpn,
          rrp: formData.rrp,
          useLargeModel: formData.useLargeModel
        }),
      })

      console.log('Response status:', response.status) // Debug log
      const data = await response.json()
      console.log('Response data:', data) // Debug log

      if (!response.ok) {
        throw new Error(data.detail || `HTTP error! status: ${response.status}`)
      }

      setGeneratedListing(data.listing)
      toast({
        title: 'Success!',
        description: 'Your eBay listing has been generated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Detailed error:', error) // Enhanced error logging
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate listing. Please try again.',
        status: 'error',
        duration: 10000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleGradeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      grade: value
    }))
  }

  return (
    <Box bg="gray.50" minH="100vh" py={10}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading 
              size={{ base: "xl", md: "2xl" }}
              color={ebayBlue}
              mb={2}
            >
              EZbay Listing Assistant
            </Heading>
            <Text color={ebayGray} fontSize={{ base: "md", md: "lg" }}>
              Create professional eBay listings in seconds
            </Text>
          </Box>
          
          <HStack spacing={{ base: 4, md: 8 }} align="start" flexDirection={{ base: "column", md: "row" }}>
            {/* Left Column - Instructions and Form */}
            <Box flex={1} width={{ base: "100%", md: "auto" }}>
              <Card mb={6} shadow="md" borderWidth="1px" borderColor={ebayBlue}>
                <CardHeader bg={ebayBlue} color="white" borderTopRadius="md">
                  <HStack>
                    <Icon as={InfoIcon} />
                    <Heading size={{ base: "sm", md: "md" }}>Instructions</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <Text fontSize={{ base: "sm", md: "md" }}>1. Enter the item name</Text>
                    <Text fontSize={{ base: "sm", md: "md" }}>2. Add the EAN (European Article Number)</Text>
                    <Text fontSize={{ base: "sm", md: "md" }}>3. Include the MPN (Manufacturer Part Number)</Text>
                    <Text fontSize={{ base: "sm", md: "md" }}>4. Enter the RRP (Recommended Retail Price)</Text>
                    <Text fontSize={{ base: "sm", md: "md" }}>5. Choose your preferred model size</Text>
                    <Text fontSize={{ base: "sm", md: "md" }}>6. Click "Generate Listing" to create your eBay description</Text>
                  </VStack>
                </CardBody>
              </Card>

              <Card shadow="md" borderWidth="1px" borderColor={ebayBlue}>
                <CardHeader bg={ebayBlue} color="white" borderTopRadius="md">
                  <Heading size={{ base: "sm", md: "md" }}>Item Details</Heading>
                </CardHeader>
                <CardBody>
                  <Box as="form" onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel color={ebayGray} fontSize={{ base: "sm", md: "md" }}>Item Name</FormLabel>
                        <Input
                          name="itemName"
                          value={formData.itemName}
                          onChange={handleChange}
                          placeholder="Enter item name"
                          borderColor={ebayBlue}
                          _focus={{ borderColor: ebayDarkBlue }}
                          size={{ base: "sm", md: "md" }}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color={ebayGray} fontSize={{ base: "sm", md: "md" }}>
                          Grade
                          <Tooltip 
                            label={
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="bold">Grading Criteria:</Text>
                                <Text>• Grade A: Mint or new condition, with all original accessories and packaging</Text>
                                <Text>• Grade B: Good condition, with all essential accessories</Text>
                                <Text>• Grade C: Working condition, with all essential accessories</Text>
                                <Text>• Grade F: Non-working, but intact and passing an IMEI check</Text>
                              </VStack>
                            }
                            placement="right"
                            hasArrow
                            openDelay={200}
                          >
                            <Icon as={InfoIcon} ml={2} color={ebayBlue} cursor="help" />
                          </Tooltip>
                        </FormLabel>
                        <RadioGroup 
                          onChange={handleGradeChange} 
                          value={formData.grade}
                          colorScheme="blue"
                        >
                          <HStack spacing={{ base: 3, md: 6 }} wrap="wrap">
                            <Radio value="A" size={{ base: "sm", md: "md" }}>Grade A</Radio>
                            <Radio value="B" size={{ base: "sm", md: "md" }}>Grade B</Radio>
                            <Radio value="C" size={{ base: "sm", md: "md" }}>Grade C</Radio>
                            <Radio value="F" size={{ base: "sm", md: "md" }}>Grade F</Radio>
                          </HStack>
                        </RadioGroup>
                      </FormControl>

                      <FormControl>
                        <FormLabel color={ebayGray} fontSize={{ base: "sm", md: "md" }}>EAN (Optional)</FormLabel>
                        <Input
                          name="ean"
                          value={formData.ean}
                          onChange={handleChange}
                          placeholder="Enter EAN (European Article Number)"
                          borderColor={ebayBlue}
                          _focus={{ borderColor: ebayDarkBlue }}
                          size={{ base: "sm", md: "md" }}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel color={ebayGray} fontSize={{ base: "sm", md: "md" }}>MPN (Optional)</FormLabel>
                        <Input
                          name="mpn"
                          value={formData.mpn}
                          onChange={handleChange}
                          placeholder="Enter MPN (Manufacturer Part Number)"
                          borderColor={ebayBlue}
                          _focus={{ borderColor: ebayDarkBlue }}
                          size={{ base: "sm", md: "md" }}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel color={ebayGray} fontSize={{ base: "sm", md: "md" }}>RRP (Optional)</FormLabel>
                        <Input
                          name="rrp"
                          type="number"
                          value={formData.rrp}
                          onChange={handleChange}
                          placeholder="Enter RRP (Recommended Retail Price)"
                          borderColor={ebayBlue}
                          _focus={{ borderColor: ebayDarkBlue }}
                          size={{ base: "sm", md: "md" }}
                        />
                      </FormControl>

                      <FormControl display="flex" alignItems="center">
                        <FormLabel mb="0" color={ebayGray} fontSize={{ base: "sm", md: "md" }}>
                          Use 70B Model (Better Quality)
                        </FormLabel>
                        <Switch
                          name="useLargeModel"
                          isChecked={formData.useLargeModel}
                          onChange={handleChange}
                          colorScheme="blue"
                          size={{ base: "sm", md: "lg" }}
                        />
                        <FormHelperText color={ebayGray} fontSize={{ base: "xs", md: "sm" }}>
                          {formData.useLargeModel ? "Using 70B model for better quality" : "Using 8B model for faster generation"}
                        </FormHelperText>
                      </FormControl>

                      <Button
                        type="submit"
                        bg={ebayBlue}
                        color="white"
                        width="full"
                        size={{ base: "md", md: "lg" }}
                        isLoading={isLoading}
                        _hover={{ bg: ebayDarkBlue }}
                      >
                        Generate Listing
                      </Button>
                    </VStack>
                  </Box>
                </CardBody>
              </Card>
            </Box>

            {/* Right Column - Preview */}
            <Box flex={1} width={{ base: "100%", md: "auto" }}>
              <Card shadow="md" borderWidth="1px" borderColor={ebayBlue}>
                <CardHeader bg={ebayBlue} color="white" borderTopRadius="md">
                  <Heading size={{ base: "sm", md: "md" }}>Generated eBay Listing</Heading>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <Box
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      bg="white"
                      minH={{ base: "300px", md: "500px" }}
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      gap={4}
                    >
                      <Box
                        width="50px"
                        height="50px"
                        border="4px solid"
                        borderColor={`${ebayBlue}33`}
                        borderTopColor={ebayBlue}
                        borderRadius="full"
                        animation="spin 1s linear infinite"
                        sx={{
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' }
                          }
                        }}
                      />
                      <Text color={ebayGray} fontSize={{ base: "md", md: "lg" }} fontWeight="medium">
                        Generating your listing...
                      </Text>
                      <Text color={ebayGray} fontSize={{ base: "xs", md: "sm" }} textAlign="center">
                        This may take a few moments
                      </Text>
                    </Box>
                  ) : generatedListing ? (
                    <VStack spacing={4} align="stretch">
                      <Box
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        bg="white"
                        minH={{ base: "300px", md: "500px" }}
                        whiteSpace="pre-wrap"
                        color={ebayGray}
                        fontFamily="monospace"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {generatedListing}
                      </Box>
                      <HStack spacing={4}>
                        <Tooltip 
                          label="Copy the entire listing to your clipboard" 
                          placement="top"
                          hasArrow
                        >
                          <Button
                            leftIcon={<Icon as={CopyIcon} />}
                            bg={ebayBlue}
                            color="white"
                            flex={1}
                            size={{ base: "sm", md: "lg" }}
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(generatedListing);
                                toast({
                                  title: 'Copied!',
                                  description: 'Listing description copied to clipboard',
                                  status: 'success',
                                  duration: 2000,
                                  isClosable: true,
                                });
                              } catch (err) {
                                console.error('Failed to copy:', err);
                                toast({
                                  title: 'Error',
                                  description: 'Failed to copy to clipboard. Please try again.',
                                  status: 'error',
                                  duration: 3000,
                                  isClosable: true,
                                });
                              }
                            }}
                            _hover={{ bg: ebayDarkBlue }}
                          >
                            Copy to Clipboard
                          </Button>
                        </Tooltip>
                        <Tooltip 
                          label="Coming soon: List directly on eBay" 
                          placement="top"
                          hasArrow
                        >
                          <Button
                            leftIcon={<Icon as={ExternalLinkIcon} />}
                            bg={ebayYellow}
                            color="white"
                            flex={1}
                            size={{ base: "sm", md: "lg" }}
                            isDisabled={true}
                            _hover={{ bg: ebayYellow }}
                            _disabled={{ bg: 'gray.300' }}
                          >
                            List on eBay
                          </Button>
                        </Tooltip>
                      </HStack>
                    </VStack>
                  ) : (
                    <Box
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.50"
                      minH={{ base: "300px", md: "500px" }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text color={ebayGray} fontSize={{ base: "sm", md: "md" }}>Your generated listing will appear here</Text>
                    </Box>
                  )}
                </CardBody>
              </Card>
            </Box>
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}

export default App 