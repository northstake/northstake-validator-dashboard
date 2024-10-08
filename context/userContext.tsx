import React, { createContext, useContext, useEffect, useState } from 'react'
import { AccountEntity } from '@northstake/northstakeapi'

interface UserContextType {
  userInfo: AccountEntity | null
  contractAddress: `0x${string}` | null
  contractABI: unknown[]
  loading: boolean
  setUserInfo: (userInfo: AccountEntity | null) => void
  setContractAddress: (address: `0x${string}` | null) => void
  setLoading: (loading: boolean) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<AccountEntity | null>(null)
  const [contractAddress, setContractAddress] = useState<`0x${string}` | null>(null)
  const [loading, setLoading] = useState(true)
  const contractABI = [
    {
      inputs: [
        { internalType: 'contract IDepositContract', name: '_depositContract', type: 'address' },
        { internalType: 'bool', name: '_isMevEnabled', type: 'bool' },
        { internalType: 'uint48', name: 'initialDelay', type: 'uint48' }
      ],
      stateMutability: 'nonpayable',
      type: 'constructor'
    },
    { inputs: [], name: 'AccessControlBadConfirmation', type: 'error' },
    {
      inputs: [{ internalType: 'uint48', name: 'schedule', type: 'uint48' }],
      name: 'AccessControlEnforcedDefaultAdminDelay',
      type: 'error'
    },
    { inputs: [], name: 'AccessControlEnforcedDefaultAdminRules', type: 'error' },
    {
      inputs: [{ internalType: 'address', name: 'defaultAdmin', type: 'address' }],
      name: 'AccessControlInvalidDefaultAdmin',
      type: 'error'
    },
    {
      inputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'bytes32', name: 'neededRole', type: 'bytes32' }
      ],
      name: 'AccessControlUnauthorizedAccount',
      type: 'error'
    },
    { inputs: [], name: 'AccessDenied', type: 'error' },
    { inputs: [], name: 'InsufficientFunds', type: 'error' },
    { inputs: [], name: 'InvalidAddressZero', type: 'error' },
    { inputs: [], name: 'InvalidWithdrawalCredentials', type: 'error' },
    { inputs: [], name: 'NoMev', type: 'error' },
    { inputs: [], name: 'ProposalAlreadyAccepted', type: 'error' },
    { inputs: [], name: 'ProposalExists', type: 'error' },
    { inputs: [], name: 'ProposalExpired', type: 'error' },
    { inputs: [], name: 'ProposalNotFound', type: 'error' },
    {
      inputs: [
        { internalType: 'uint8', name: 'bits', type: 'uint8' },
        { internalType: 'uint256', name: 'value', type: 'uint256' }
      ],
      name: 'SafeCastOverflowedUintDowncast',
      type: 'error'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { indexed: false, internalType: 'address', name: 'account', type: 'address' }
      ],
      name: 'AccessControlAcceptedRole',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { indexed: false, internalType: 'bytes32', name: 'adminRole', type: 'bytes32' }
      ],
      name: 'AccessControlAcceptedRoleAdmin',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { indexed: false, internalType: 'address', name: 'account', type: 'address' }
      ],
      name: 'AccessControlProposedRole',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { indexed: false, internalType: 'bytes32', name: 'adminRole', type: 'bytes32' }
      ],
      name: 'AccessControlProposedRoleAdmin',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { indexed: false, internalType: 'address', name: 'account', type: 'address' }
      ],
      name: 'AccessControlRejectedRole',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { indexed: false, internalType: 'bytes32', name: 'adminRole', type: 'bytes32' }
      ],
      name: 'AccessControlRejectedRoleAdmin',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'beneficiary', type: 'address' },
        { indexed: false, internalType: 'bytes32', name: 'proposalId', type: 'bytes32' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
      ],
      name: 'ClaimedWithdrawal',
      type: 'event'
    },
    { anonymous: false, inputs: [], name: 'DefaultAdminDelayChangeCanceled', type: 'event' },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: 'uint48', name: 'newDelay', type: 'uint48' },
        { indexed: false, internalType: 'uint48', name: 'effectSchedule', type: 'uint48' }
      ],
      name: 'DefaultAdminDelayChangeScheduled',
      type: 'event'
    },
    { anonymous: false, inputs: [], name: 'DefaultAdminTransferCanceled', type: 'event' },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'newAdmin', type: 'address' },
        { indexed: false, internalType: 'uint48', name: 'acceptSchedule', type: 'uint48' }
      ],
      name: 'DefaultAdminTransferScheduled',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'depositor', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
      ],
      name: 'Deposit',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'depositor', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
      ],
      name: 'DepositWithdrawn',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: 'bytes32', name: 'proposalId', type: 'bytes32' }],
      name: 'Proposal',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: 'bytes32', name: 'proposalId', type: 'bytes32' }],
      name: 'ProposalAccepted',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: 'bytes32', name: 'proposalId', type: 'bytes32' }],
      name: 'ProposalRejected',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
      ],
      name: 'RewardsCollected',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [{ indexed: true, internalType: 'address', name: 'recipient', type: 'address' }],
      name: 'RewardsRecipientChanged',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { indexed: true, internalType: 'bytes32', name: 'previousAdminRole', type: 'bytes32' },
        { indexed: true, internalType: 'bytes32', name: 'newAdminRole', type: 'bytes32' }
      ],
      name: 'RoleAdminChanged',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { indexed: true, internalType: 'address', name: 'account', type: 'address' },
        { indexed: true, internalType: 'address', name: 'sender', type: 'address' }
      ],
      name: 'RoleGranted',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { indexed: true, internalType: 'address', name: 'account', type: 'address' },
        { indexed: true, internalType: 'address', name: 'sender', type: 'address' }
      ],
      name: 'RoleRevoked',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: 'bytes', name: 'pubkey', type: 'bytes' }],
      name: 'ValidatorQueued',
      type: 'event'
    },
    {
      inputs: [],
      name: 'DEFAULT_ADMIN_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'DEPOSITOR_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'OPERATOR_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'ORACLE_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'ROLE_PROPOSER_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function'
    },
    { inputs: [], name: 'acceptDefaultAdminTransfer', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
      inputs: [{ internalType: 'bytes32', name: 'proposalId', type: 'bytes32' }],
      name: 'acceptExit',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' }
      ],
      name: 'acceptRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'bytes32', name: 'adminRole', type: 'bytes32' }
      ],
      name: 'acceptRoleAdmin',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'address', name: 'newAdmin', type: 'address' }],
      name: 'beginDefaultAdminTransfer',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    { inputs: [], name: 'cancelDefaultAdminTransfer', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
      inputs: [{ internalType: 'uint48', name: 'newDelay', type: 'uint48' }],
      name: 'changeDefaultAdminDelay',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'proposalId', type: 'bytes32' }],
      name: 'claimWithdrawals',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'address', name: 'beneficiary', type: 'address' }],
      name: 'claimWithdrawals',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'address', name: 'beneficiary', type: 'address' },
        { internalType: 'uint256', name: '', type: 'uint256' }
      ],
      name: 'claims',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function'
    },
    { inputs: [], name: 'collectRewards', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
      inputs: [],
      name: 'defaultAdmin',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'defaultAdminDelay',
      outputs: [{ internalType: 'uint48', name: '', type: 'uint48' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'defaultAdminDelayIncreaseWait',
      outputs: [{ internalType: 'uint48', name: '', type: 'uint48' }],
      stateMutability: 'view',
      type: 'function'
    },
    { inputs: [], name: 'deposit', outputs: [], stateMutability: 'payable', type: 'function' },
    {
      inputs: [],
      name: 'depositContract',
      outputs: [{ internalType: 'contract IDepositContract', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          components: [
            { internalType: 'address', name: 'beneficiary', type: 'address' },
            { internalType: 'uint96', name: 'deadline', type: 'uint96' },
            { internalType: 'uint64[]', name: 'validatorIndices', type: 'uint64[]' }
          ],
          internalType: 'struct NSTokenizedStakingVault.ExitProposal',
          name: 'proposal',
          type: 'tuple'
        }
      ],
      name: 'exitProposalId',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'pure',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'id', type: 'bytes32' }],
      name: 'exitProposals',
      outputs: [
        {
          components: [
            { internalType: 'address', name: 'beneficiary', type: 'address' },
            { internalType: 'uint96', name: 'deadline', type: 'uint96' },
            { internalType: 'uint64[]', name: 'validatorIndices', type: 'uint64[]' }
          ],
          internalType: 'struct NSTokenizedStakingVault.ExitProposal',
          name: 'proposal',
          type: 'tuple'
        },
        { internalType: 'bool', name: 'accepted', type: 'bool' }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleAdmin',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'uint256', name: 'index', type: 'uint256' }
      ],
      name: 'getRoleMember',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleMemberCount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'uint256', name: 'index', type: 'uint256' }
      ],
      name: 'getRoleProposal',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleProposalsCount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' }
      ],
      name: 'grantRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' }
      ],
      name: 'hasRole',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'isMevEnabled',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'pendingDefaultAdmin',
      outputs: [
        { internalType: 'address', name: 'newAdmin', type: 'address' },
        { internalType: 'uint48', name: 'schedule', type: 'uint48' }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'pendingDefaultAdminDelay',
      outputs: [
        { internalType: 'uint48', name: 'newDelay', type: 'uint48' },
        { internalType: 'uint48', name: 'schedule', type: 'uint48' }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'pendingDeposits',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'pendingWithdrawals',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          components: [
            { internalType: 'address', name: 'beneficiary', type: 'address' },
            { internalType: 'uint96', name: 'deadline', type: 'uint96' },
            { internalType: 'uint64[]', name: 'validatorIndices', type: 'uint64[]' }
          ],
          internalType: 'struct NSTokenizedStakingVault.ExitProposal',
          name: 'proposal',
          type: 'tuple'
        }
      ],
      name: 'proposeExit',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' }
      ],
      name: 'proposeRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'bytes32', name: 'adminRole', type: 'bytes32' }
      ],
      name: 'proposeRoleAdmin',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          components: [
            { internalType: 'bytes', name: 'pubkey', type: 'bytes' },
            { internalType: 'bytes', name: 'withdrawalCredentials', type: 'bytes' },
            { internalType: 'bytes', name: 'signature', type: 'bytes' },
            { internalType: 'bytes32', name: 'depositDataRoot', type: 'bytes32' }
          ],
          internalType: 'struct NSTokenizedStakingVault.DepositData',
          name: '_deposit',
          type: 'tuple'
        }
      ],
      name: 'queueValidator',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          components: [
            { internalType: 'bytes', name: 'pubkey', type: 'bytes' },
            { internalType: 'bytes', name: 'withdrawalCredentials', type: 'bytes' },
            { internalType: 'bytes', name: 'signature', type: 'bytes' },
            { internalType: 'bytes32', name: 'depositDataRoot', type: 'bytes32' }
          ],
          internalType: 'struct NSTokenizedStakingVault.DepositData[]',
          name: 'deposits',
          type: 'tuple[]'
        }
      ],
      name: 'queueValidator',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'proposalId', type: 'bytes32' }],
      name: 'rejectExit',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' }
      ],
      name: 'rejectRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'bytes32', name: 'adminRole', type: 'bytes32' }
      ],
      name: 'rejectRoleAdmin',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' }
      ],
      name: 'renounceRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' }
      ],
      name: 'revokeRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'rewards',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'rewardsRecipient',
      outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function'
    },
    { inputs: [], name: 'rollbackDefaultAdminDelay', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
      inputs: [{ internalType: 'address payable', name: 'recipient', type: 'address' }],
      name: 'setRewardsRecipient',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          components: [
            { internalType: 'uint64', name: 'validatorIndex', type: 'uint64' },
            { internalType: 'uint64', name: 'blockNumber', type: 'uint64' },
            { internalType: 'uint48', name: 'amountGwei', type: 'uint48' }
          ],
          internalType: 'struct NSTokenizedStakingVault.Withdrawal[]',
          name: 'withdrawals',
          type: 'tuple[]'
        }
      ],
      name: 'updateWithdrawal',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'uint64', name: 'validatorIndex', type: 'uint64' },
        { internalType: 'uint64', name: 'blockNumber', type: 'uint64' },
        { internalType: 'uint48', name: 'amountGwei', type: 'uint48' }
      ],
      name: 'updateWithdrawal',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'uint64', name: 'validatorIndex', type: 'uint64' }],
      name: 'validatorWithdrawals',
      outputs: [
        { internalType: 'uint64', name: 'blockNumber', type: 'uint64' },
        { internalType: 'uint48', name: 'amountGwei', type: 'uint48' }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'uint256', name: 'wad', type: 'uint256' }],
      name: 'withdrawDeposit',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'withdrawalCredential',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function'
    },
    { stateMutability: 'payable', type: 'receive' }
  ]

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        setUserInfo(data.user)
        if (data.user?.smartContracts?.[0]?.address) {
          setContractAddress(data.user.smartContracts[0].address as `0x${string}`)
        }
      } catch (error) {
        console.error('Failed to fetch user information', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  return (
    <UserContext.Provider
      value={{ userInfo, contractAddress, contractABI, loading, setUserInfo, setContractAddress, setLoading }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
