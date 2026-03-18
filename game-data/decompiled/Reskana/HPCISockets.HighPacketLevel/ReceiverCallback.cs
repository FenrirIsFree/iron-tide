using ManualPacketSerialization;

namespace HPCISockets.HighPacketLevel;

public delegate void ReceiverCallback<T>(ref T _007B10695_007D) where T : IMPSerializable;
