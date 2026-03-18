using System;
using System.Collections.Concurrent;

namespace ManualPacketSerialization.Database;

public class ConcurrentMPDatabase<T> : Database<T> where T : class, ITKSerializable
{
	private MultiPartitionFileSet file;

	private ConcurrentQueue<BufferedDataHolder> tempBufferPool;

	private int itemsBySinglePageFile;

	private int maxObjectSize;

	public ConcurrentMPDatabase(Func<T, uint> _007B11065_007D, int _007B11066_007D, int _007B11067_007D, params MPSKeyFieldInformation<T>[] _007B11068_007D)
		: base(_007B11065_007D, _007B11068_007D)
	{
		itemsBySinglePageFile = _007B11067_007D;
		maxObjectSize = _007B11066_007D;
		tempBufferPool = new ConcurrentQueue<BufferedDataHolder>();
		for (int i = 0; i < _007B11066_007D / 100 + 1; i++)
		{
			tempBufferPool.Enqueue(new BufferedDataHolder(new byte[_007B11066_007D], 0));
		}
	}

	public void Begin(string _007B11069_007D)
	{
		file = new MultiPartitionFileSet(maxObjectSize, itemsBySinglePageFile, _007B11069_007D, _007B11179_007D: true);
	}

	public void SaveItem(T _007B11070_007D)
	{
		uint num = getId(_007B11070_007D);
		if (!tempBufferPool.TryDequeue(out BufferedDataHolder result))
		{
			result = new BufferedDataHolder(new byte[maxObjectSize], 0);
		}
		DeltaStream.BoxingTk(_007B11070_007D, result);
		file.WriteData((int)num, result.UsedBuffer, result.LastOperationBytesCount, _007B11185_007D: true);
		tempBufferPool.Enqueue(result);
		hotData.AddOrUpdate(num, _007B11070_007D, (uint _007B11074_007D, T _007B11075_007D) => _007B11070_007D);
		UpdateKeyFields(_007B11070_007D, num);
	}

	public T LoadItem(uint _007B11071_007D)
	{
		if (hotData.TryGetValue(_007B11071_007D, out var value))
		{
			return value;
		}
		if (!tempBufferPool.TryDequeue(out BufferedDataHolder result))
		{
			result = new BufferedDataHolder(new byte[maxObjectSize], 0);
		}
		if (!file.ReadData((int)_007B11071_007D, result.UsedBuffer, out result.LastOperationBytesCount))
		{
			return null;
		}
		value = DeltaStream.UnboxingTk<T>(result);
		tempBufferPool.Enqueue(result);
		hotData.TryAdd(_007B11071_007D, value);
		return value;
	}

	public T GetByKeyField(byte _007B11072_007D, object _007B11073_007D)
	{
		if (keyFieldDict[_007B11072_007D].keyTable.TryGetValue(_007B11073_007D, out var value))
		{
			return LoadItem(value);
		}
		return null;
	}
}
