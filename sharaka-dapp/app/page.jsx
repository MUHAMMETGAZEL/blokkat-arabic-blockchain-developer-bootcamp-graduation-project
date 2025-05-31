/*'use client'

import WalletConnectButton from '../components/WalletConnectButton'
import { useAccount, useContractWrite, useContractRead } from 'wagmi'
import abi from '../contract/abi.json'
import { contractAddress } from '../contract/contract'

export default function Home() {
  const { isConnected, address } = useAccount()

  const { write: invest } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: 'invest',
  })

  const { write: distributeProfits } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: 'distributeProfits',
  })

  const { write: withdrawProfits } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: 'withdrawProfits',
  })

  const { data: investorCount } = useContractRead({
    address: contractAddress,
    abi,
    functionName: 'getInvestorCount',
    watch: true,
  })

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6">🌙 منصة شراكة إسلامية</h1>

      <WalletConnectButton />

      {isConnected && (
        <div className="mt-8 space-y-4">
          <button
            onClick={() => invest({ value: BigInt(1e18) })}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            استثمار 1 ETH
          </button>

          <button
            onClick={() => distributeProfits({ value: BigInt(1e17) })}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            توزيع أرباح 0.1 ETH (للمالك فقط)
          </button>

          <button
            onClick={() => withdrawProfits()}
            className="bg-yellow-600 text-white px-4 py-2 rounded"
          >
            سحب الأرباح
          </button>

          <p>عدد المستثمرين الحاليين: {investorCount?.toString()}</p>
          <p>محفظتك: {address}</p>
        </div>
      )}
    </div>
  )
}
*/




















'use client'

import WalletConnectButton from '../components/WalletConnectButton'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import abi from '../contract/abi.json'
import { contractAddress } from '../contract/contract'
import { useState, useEffect } from 'react'
import { formatEther, parseEther } from 'viem'

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  const { isConnected, address } = useAccount()
  const { writeContract } = useWriteContract()
  const [investmentAmount, setInvestmentAmount] = useState('0.1')
  const [profitAmount, setProfitAmount] = useState('0.1')
  
  const [isInvesting, setIsInvesting] = useState(false)
  const [isDistributing, setIsDistributing] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const { data: investorCount } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'getInvestorCount',
  })
  
  const { data: totalInvestments } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'totalInvestments',
  })
  
  const { data: userProfits } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'profits',
    args: [address],
    query: { enabled: !!address },
  })
  
  const { data: userInvestment } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'investors',
    args: [address],
    query: { enabled: !!address },
  })

  const handleInvest = async () => {
    try {
      setIsInvesting(true)
      const value = parseEther(investmentAmount)
      await writeContract({
        address: contractAddress,
        abi,
        functionName: 'invest',
        value,
      })
    } catch (error) {
      console.error('فشل في الاستثمار:', error)
    } finally {
      setIsInvesting(false)
    }
  }

  const handleDistribute = async () => {
    try {
      setIsDistributing(true)
      const value = parseEther(profitAmount)
      await writeContract({
        address: contractAddress,
        abi,
        functionName: 'distributeProfits',
        value,
      })
    } catch (error) {
      console.error('فشل في توزيع الأرباح:', error)
    } finally {
      setIsDistributing(false)
    }
  }

  const handleWithdraw = async () => {
    try {
      setIsWithdrawing(true)
      await writeContract({
        address: contractAddress,
        abi,
        functionName: 'withdrawProfits',
      })
    } catch (error) {
      console.error('فشل في سحب الأرباح:', error)
    } finally {
      setIsWithdrawing(false)
    }
  }

  // دالة مساعدة للتأكد من وجود القيمة قبل التنسيق
  const safeFormatEther = (value) => {
    try {
      return value ? formatEther(value) : '0'
    } catch (error) {
      console.error('خطأ في تنسيق القيمة:', error)
      return '0'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
      <div className="text-center mb-8">
      <div className="inline-block">
              <WalletConnectButton />
            </div>
      </div>

      {isClient && isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* لوحة معلومات المستخدم */}
          <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
            <h2 className="text-xl font-bold text-emerald-800 mb-4">معلومات المستثمر</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">المحفظة:</span>
                <span className="font-mono text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">استثمارك:</span>
                <span className="font-bold">
                  {userInvestment?.investment ? safeFormatEther(userInvestment.investment) : '0'} ETH
                </span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">أرباحك:</span>
                <span className="font-bold text-green-600">
                  {userProfits ? safeFormatEther(userProfits) : '0'} ETH
                </span>
              </div>
            </div>
          </div>

          {/* إحصائيات المنصة */}
          <div className="bg-cyan-50 rounded-xl p-6 border border-cyan-100">
            <h2 className="text-xl font-bold text-cyan-800 mb-4">إحصائيات المنصة</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">عدد المستثمرين:</span>
                <span className="font-bold">{investorCount?.toString() || '0'}</span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">إجمالي الاستثمارات:</span>
                <span className="font-bold">
                  {totalInvestments ? safeFormatEther(totalInvestments) : '0'} ETH
                </span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">حصة المالك:</span>
                <span className="font-bold">30%</span>
              </div>
            </div>
          </div>
          
          {/* استثمار جديد */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">استثمار جديد</h2>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-600">المبلغ (ETH)</label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                className="w-full p-3 border rounded-lg text-right focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                min="0.01"
                step="0.01"
              />
            </div>
            
            <button
              onClick={handleInvest}
              disabled={isInvesting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition flex justify-center items-center"
            >
              {isInvesting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري المعالجة...
                </>
              ) : `استثمار ${investmentAmount} ETH`}
            </button>
          </div>
          
          {/* إدارة الأرباح */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">إدارة الأرباح</h2>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-600">مبلغ الأرباح (ETH)</label>
              <input
                type="number"
                value={profitAmount}
                onChange={(e) => setProfitAmount(e.target.value)}
                className="w-full p-3 border rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0.01"
                step="0.01"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={handleDistribute}
                disabled={isDistributing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition flex justify-center items-center"
              >
                {isDistributing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري التوزيع...
                  </>
                ) : 'توزيع الأرباح'}
              </button>
              
              <button
                onClick={handleWithdraw}
                disabled={!userProfits || userProfits <= 0 || isWithdrawing}
                className={`${
                  (!userProfits || userProfits <= 0) ? 'bg-gray-300 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700'
                } text-white px-4 py-3 rounded-lg font-medium transition flex justify-center items-center`}
              >
                {isWithdrawing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري السحب...
                  </>
                ) : `سحب الأرباح`}
              </button>
            </div>
            
            {userProfits && userProfits > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p className="text-yellow-700 font-medium">
                  لديك {safeFormatEther(userProfits)} ETH أرباح متاحة للسحب
                </p>
              </div>
            )}
          </div>

          {/* معلومات إضافية */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 shadow-sm col-span-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  كيف تعمل المنصة؟
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-emerald-700 mb-2">١. الاستثمار</h3>
                    <p className="text-gray-600 text-sm">
                      يقوم المستثمرون بإيداع الأموال (ETH) في العقد الذكي. كل استثمار يسجل في سجلات المنصة ويحدد حصة المستثمر من إجمالي الاستثمارات.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-blue-700 mb-2">٢. توزيع الأرباح</h3>
                    <p className="text-gray-600 text-sm">
                      المالك (صاحب المنصة) يقوم بتوزيع الأرباح على المستثمرين. تحتفظ المنصة بـ 30% كحصة للمالك، وتوزع الـ 70% الباقية على المستثمرين حسب حصصهم.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-amber-700 mb-2">٣. سحب الأرباح</h3>
                    <p className="text-gray-600 text-sm">
                      يمكن للمستثمرين سحب أرباحهم في أي وقت. الأرباح تبقى محفوظة في العقد الذكي حتى يقوم المستثمر بسحبها.
                    </p>
                  </div>
                </div>
              </div>
            </div>
      )}
    </div>
  )
}