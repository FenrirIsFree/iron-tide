using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace ManualPacketSerialization.Database;

public class Database<T> where T : class, ITKSerializable
{
	internal const int CConcurrentDictionaryThreads = 4;

	internal const int CConcurrentDictionaryStartSize = 11001;

	protected readonly SchemaAccessByKeyField<T>[] keyFieldDict;

	protected Func<T, uint> getId;

	protected readonly ConcurrentDictionary<uint, T> hotData;

	public int CacheSize => hotData.Count;

	public Database(Func<T, uint> _007B11134_007D, params MPSKeyFieldInformation<T>[] _007B11135_007D)
	{
		List<MPSKeyFieldInformation<T>> list = _007B11135_007D.ToList();
		keyFieldDict = new SchemaAccessByKeyField<T>[(list.Count != 0) ? (list.Max((MPSKeyFieldInformation<T> _007B11138_007D) => _007B11138_007D.FieldPublicID) + 1) : 0];
		foreach (MPSKeyFieldInformation<T> item in list)
		{
			keyFieldDict[item.FieldPublicID] = new SchemaAccessByKeyField<T>(item);
		}
		getId = _007B11134_007D;
		hotData = new ConcurrentDictionary<uint, T>(4, 11001);
	}

	internal void CleanCacheInternal()
	{
		hotData.Clear();
		for (int i = 0; i < keyFieldDict.Length; i++)
		{
			keyFieldDict[i]?.keyTable.Clear();
		}
	}

	protected void UpdateKeyFields(T _007B11136_007D, uint _007B11137_007D)
	{
		for (int i = 0; i < keyFieldDict.Length; i++)
		{
			SchemaAccessByKeyField<T> schemaAccessByKeyField = keyFieldDict[i];
			if (schemaAccessByKeyField != null)
			{
				object key = schemaAccessByKeyField.info.GetValue(_007B11136_007D);
				schemaAccessByKeyField.keyTable.AddOrUpdate(key, _007B11137_007D, (object _007B11139_007D, uint _007B11140_007D) => _007B11137_007D);
			}
		}
	}
}
