import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

import base from '@mc-builder/shared/src/components/base';
import { colors } from '@mc-builder/shared/src/styles';

const SyncScreen = ({
  didSync,
  isSyncing,
  check,
  sync,
}: {
  didSync: boolean;
  isSyncing: boolean;
  check: () => Promise<boolean>;
  sync: () => Promise<boolean>;
}) => {
  const [showRetry, setShowRetry] = useState<boolean>(false);

  const performSync = useCallback(async () => {
    setShowRetry(false);
    const syncDidSucceed = await sync();
    if (syncDidSucceed) {
      check();
    } else {
      setShowRetry(true);
    }
  }, [check, sync]);

  useEffect(() => {
    if (didSync == null) {
      check();
    }
  }, [didSync, check]);

  useEffect(() => {
    if (didSync === false) {
      performSync();
    }
  }, [didSync, performSync]);

  if (showRetry) {
    return (
      <Container>
        <RetryContainer>
          <RetryHeader>Card Sync Failed</RetryHeader>
          <RetryMessage>
            Please ensure that you are connected to the internet and try again.
          </RetryMessage>
          <RetryButtonWrapper onPress={() => performSync()}>
            {({ pressed }) => (
              <RetryButton pressed={pressed}>
                <RetryButtonText pressed={pressed}>Try Again</RetryButtonText>
              </RetryButton>
            )}
          </RetryButtonWrapper>
        </RetryContainer>
      </Container>
    );
  }

  return (
    <Container>
      {isSyncing ? (
        <ActivityContainer>
          <ActivityIndicator color={colors.orange600} size="large" />
          <ActivityMessage>
            <ActivityMessageText>Syncing Data...</ActivityMessageText>
          </ActivityMessage>
        </ActivityContainer>
      ) : null}
    </Container>
  );
};

const Container = styled(base.Container)`
  background-color: ${colors.slate100};
  flex-direction: row;
  justify-content: center;
`;

const ActivityContainer = styled.View`
  background: ${colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-horizontal: 32px;
  padding: 32px;
`;

const ActivityMessage = styled.View`
  align-items: center;
  margin-top: 16px;
`;

const ActivityMessageText = styled.Text`
  color: ${({ theme }) => theme.fontColor.primary};
  font-size: ${({ theme }) => theme.fontSize.label};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const RetryContainer = styled.View`
  background: ${colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-horizontal: 32px;
  padding: 32px;
`;

const RetryHeader = styled.Text`
  color: ${({ theme }) => theme.fontColor.primary};
  font-size: ${({ theme }) => theme.fontSize.heading};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin-bottom: 8px;
`;

const RetryMessage = styled.Text`
  color: ${({ theme }) => theme.fontColor.primary};
  font-size: ${({ theme }) => theme.fontSize.label};
  margin-bottom: 16px;
`;

const RetryButtonWrapper = styled(base.ButtonWrapper)``;

const RetryButton = styled(base.Button)<{ pressed?: boolean }>`
  background-color: ${(props) =>
    props.pressed ? colors.green500 : colors.green400};
`;

const RetryButtonText = styled(base.ButtonText)<{ pressed?: boolean }>``;

export default SyncScreen;
