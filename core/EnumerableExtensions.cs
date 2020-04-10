using System.Collections.Generic;
using System.Linq;

public static class EnumerableExtensions
{
    public static int IndexOf<T>(this IEnumerable<T> source, T value, IEqualityComparer<T> comparer = null)
    {
        comparer = comparer ?? EqualityComparer<T>.Default;
        var found = source
            .Select((element, i) => new { element = element, i })
            .FirstOrDefault(x => comparer.Equals(x.element, value));
        return found == null ? -1 : found.i;
    }
}