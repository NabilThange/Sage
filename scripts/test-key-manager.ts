/**
 * Test script for Key Manager
 * Run with: npx tsx scripts/test-key-manager.ts
 */

import { getGroqKeyManager, executeWithKeyRotation } from '../lib/key-manager'

async function testKeyManager() {
  console.log('🧪 Testing Key Manager\n')

  const manager = getGroqKeyManager()

  // Test 1: Check key loading
  console.log('Test 1: Key Loading')
  console.log(`Total keys loaded: ${manager.getKeyCount()}`)
  console.log(`Has available keys: ${manager.hasAvailableKeys()}`)
  console.log('')

  // Test 2: Get initial status
  console.log('Test 2: Initial Status')
  console.log(JSON.stringify(manager.getStatus(), null, 2))
  console.log('')

  // Test 3: Simulate key rotation
  console.log('Test 3: Key Rotation (5 requests)')
  for (let i = 1; i <= 5; i++) {
    const key = manager.getKey()
    console.log(`Request ${i}: Got key ${key ? '✓' : '✗'}`)
  }
  console.log('')

  // Test 4: Simulate failures
  console.log('Test 4: Simulating Failures')
  const testKey = manager.getKey()
  if (testKey) {
    console.log('Reporting 3 failures for a key...')
    manager.reportFailure(testKey, new Error('Test error 1'))
    manager.reportFailure(testKey, new Error('Test error 2'))
    manager.reportFailure(testKey, new Error('Test error 3'))
    console.log('Key should now be blocked')
    console.log(JSON.stringify(manager.getStatus(), null, 2))
  }
  console.log('')

  // Test 5: Test executeWithKeyRotation
  console.log('Test 5: Execute with Key Rotation')
  try {
    const result = await executeWithKeyRotation(
      manager,
      async (apiKey) => {
        console.log(`Attempting API call with key: ${apiKey.substring(0, 10)}...`)
        // Simulate API call
        return { success: true, key: apiKey.substring(0, 10) }
      },
      2
    )
    console.log('Result:', result)
  } catch (error) {
    console.error('Error:', error)
  }
  console.log('')

  // Test 6: Final status
  console.log('Test 6: Final Status')
  console.log(JSON.stringify(manager.getStatus(), null, 2))
  console.log('')

  console.log('✅ Key Manager tests complete!')
}

// Run tests
testKeyManager().catch(console.error)
