namespace HPCISockets.HighPacketLevel;

public enum ServerTaskType
{
	NotStated,
	DeferredInUpdate,
	ConcurrencyUpdate,
	UnsafeDirect,
	UnsafeDirectWhenNoUpdate,
	ThreadPool
}
