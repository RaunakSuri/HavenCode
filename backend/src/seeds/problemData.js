/**
 * 10 High-Quality Coding Problems for HavenCode
 * 3 Easy, 4 Medium, 3 Hard
 * Complete executable solutions for C++, Java, Python, and JavaScript
 */

export const seedProblems = [
  // ==========================================
  // 1. EASY - Two Sum (array)
  // ==========================================
  {
    title: "Two Sum",
    difficulty: "easy",
    tags: "array",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order (indices space-separated).

### Input Format
- First line contains two integers: \`n\` (size of array) and \`target\`.
- Second line contains \`n\` space-separated integers.

### Output Format
- Print the two 0-based indices separated by a space.

### Constraints
- \`2 <= n <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
- Only one valid answer exists.`,
    visibleTestCases: [
      {
        input: "4 9\n2 7 11 15",
        output: "0 1",
        explanation: "nums[0] + nums[1] == 2 + 7 == 9, so we return 0 1.",
      },
      {
        input: "3 6\n3 2 4",
        output: "1 2",
        explanation: "nums[1] + nums[2] == 2 + 4 == 6, so we return 1 2.",
      },
      {
        input: "2 6\n3 3",
        output: "0 1",
        explanation: "nums[0] + nums[1] == 3 + 3 == 6, so we return 0 1.",
      },
    ],
    hiddenTestCases: [
      {
        input: "5 10\n1 3 5 7 9",
        output: "1 3",
      },
      {
        input: "4 -8\n-3 -5 2 7",
        output: "0 1",
      },
      {
        input: "6 0\n-5 -2 0 2 5 8",
        output: "0 4",
      },
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    int n, target;
    if (!(cin >> n >> target)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // Write your solution here

    return 0;
}`,
      },
      {
        language: "java",
        initialCode: `import java.util.Scanner;
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();

        // Write your solution here
    }
}`,
      },
      {
        language: "python",
        initialCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    target = int(tokens[1])
    nums = [int(x) for x in tokens[2:2+n]]

    # Write your solution here

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 2) return;
    const n = parseInt(tokens[0], 10);
    const target = parseInt(tokens[1], 10);
    const nums = tokens.slice(2, 2 + n).map(x => parseInt(x, 10));

    // Write your solution here
}

main();`,
      },
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    int n, target;
    if (!(cin >> n >> target)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    unordered_map<int, int> seen;
    for (int i = 0; i < n; i++) {
        int complement = target - nums[i];
        if (seen.find(complement) != seen.end()) {
            cout << seen[complement] << " " << i;
            return 0;
        }
        seen[nums[i]] = i;
    }
    return 0;
}`,
      },
      {
        language: "java",
        completeCode: `import java.util.Scanner;
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();

        HashMap<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                System.out.println(seen.get(complement) + " " + i);
                return;
            }
            seen.put(nums[i], i);
        }
    }
}`,
      },
      {
        language: "python",
        completeCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    target = int(tokens[1])
    nums = [int(x) for x in tokens[2:2+n]]

    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            print(f"{seen[complement]} {i}")
            return
        seen[num] = i

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 2) return;
    const n = parseInt(tokens[0], 10);
    const target = parseInt(tokens[1], 10);
    const nums = tokens.slice(2, 2 + n).map(x => parseInt(x, 10));

    const seen = new Map();
    for (let i = 0; i < n; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            console.log(seen.get(complement) + " " + i);
            return;
        }
        seen.set(nums[i], i);
    }
}

main();`,
      },
    ],
  },

  // ==========================================
  // 2. EASY - Valid Anagram (strings)
  // ==========================================
  {
    title: "Valid Anagram",
    difficulty: "easy",
    tags: "strings",
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

### Input Format
- First line contains string \`s\`.
- Second line contains string \`t\`.

### Output Format
- Print \`true\` or \`false\`.

### Constraints
- \`1 <= s.length, t.length <= 5 * 10^4\`
- \`s\` and \`t\` consist of lowercase English letters.`,
    visibleTestCases: [
      {
        input: "anagram\nnagaram",
        output: "true",
        explanation: "Both strings contain 3 a's, 1 n, 1 g, 1 r, and 1 m.",
      },
      {
        input: "rat\ncar",
        output: "false",
        explanation: "'rat' contains 't', while 'car' contains 'c'.",
      },
      {
        input: "listen\nsilent",
        output: "true",
        explanation: "All letters match in frequency.",
      },
    ],
    hiddenTestCases: [
      {
        input: "a\nab",
        output: "false",
      },
      {
        input: "ab\nba",
        output: "true",
      },
      {
        input: "aabbcc\nabcabc",
        output: "true",
      },
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s, t;
    if (!(cin >> s >> t)) return 0;

    // Write your solution here

    return 0;
}`,
      },
      {
        language: "java",
        initialCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s = sc.next();
        String t = sc.next();

        // Write your solution here
    }
}`,
      },
      {
        language: "python",
        initialCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if len(tokens) < 2:
        return
    s, t = tokens[0], tokens[1]

    # Write your solution here

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 2) return;
    const [s, t] = tokens;

    // Write your solution here
}

main();`,
      },
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    string s, t;
    if (!(cin >> s >> t)) return 0;
    if (s.length() != t.length()) {
        cout << "false";
        return 0;
    }
    vector<int> counts(26, 0);
    for (char c : s) counts[c - 'a']++;
    for (char c : t) {
        if (--counts[c - 'a'] < 0) {
            cout << "false";
            return 0;
        }
    }
    cout << "true";
    return 0;
}`,
      },
      {
        language: "java",
        completeCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s = sc.next();
        String t = sc.next();

        if (s.length() != t.length()) {
            System.out.println("false");
            return;
        }
        int[] counts = new int[26];
        for (int i = 0; i < s.length(); i++) {
            counts[s.charAt(i) - 'a']++;
        }
        for (int i = 0; i < t.length(); i++) {
            counts[t.charAt(i) - 'a']--;
            if (counts[t.charAt(i) - 'a'] < 0) {
                System.out.println("false");
                return;
            }
        }
        System.out.println("true");
    }
}`,
      },
      {
        language: "python",
        completeCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if len(tokens) < 2:
        return
    s, t = tokens[0], tokens[1]
    if len(s) != len(t):
        print("false")
        return
    from collections import Counter
    if Counter(s) == Counter(t):
        print("true")
    else:
        print("false")

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 2) return;
    const [s, t] = tokens;
    if (s.length !== t.length) {
        console.log("false");
        return;
    }
    const counts = {};
    for (const ch of s) {
        counts[ch] = (counts[ch] || 0) + 1;
    }
    for (const ch of t) {
        if (!counts[ch]) {
            console.log("false");
            return;
        }
        counts[ch]--;
    }
    console.log("true");
}

main();`,
      },
    ],
  },

  // ==========================================
  // 3. EASY - Contains Duplicate (array)
  // ==========================================
  {
    title: "Contains Duplicate",
    difficulty: "easy",
    tags: "array",
    description: `Given an integer array \`nums\`, return \`true\` if any value appears at least twice in the array, and return \`false\` if every element is distinct.

### Input Format
- First line contains integer \`n\` (number of elements).
- Second line contains \`n\` space-separated integers.

### Output Format
- Print \`true\` if duplicates exist, otherwise print \`false\`.

### Constraints
- \`1 <= n <= 10^5\`
- \`-10^9 <= nums[i] <= 10^9\``,
    visibleTestCases: [
      {
        input: "4\n1 2 3 1",
        output: "true",
        explanation: "1 appears twice in the array.",
      },
      {
        input: "4\n1 2 3 4",
        output: "false",
        explanation: "All elements are pairwise distinct.",
      },
      {
        input: "10\n1 1 1 3 3 4 3 2 4 2",
        output: "true",
        explanation: "Multiple elements appear repeatedly.",
      },
    ],
    hiddenTestCases: [
      {
        input: "1\n99",
        output: "false",
      },
      {
        input: "2\n5 5",
        output: "true",
      },
      {
        input: "5\n-1 -2 -3 -4 -1",
        output: "true",
      },
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // Write your solution here

    return 0;
}`,
      },
      {
        language: "java",
        initialCode: `import java.util.Scanner;
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();

        // Write your solution here
    }
}`,
      },
      {
        language: "python",
        initialCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:1+n]]

    # Write your solution here

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length === 0) return;
    const n = parseInt(tokens[0], 10);
    const nums = tokens.slice(1, 1 + n).map(x => parseInt(x, 10));

    // Write your solution here
}

main();`,
      },
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    unordered_set<int> seen;
    bool hasDuplicate = false;
    for (int i = 0; i < n; i++) {
        int val;
        cin >> val;
        if (seen.find(val) != seen.end()) {
            hasDuplicate = true;
        }
        seen.insert(val);
    }
    cout << (hasDuplicate ? "true" : "false");
    return 0;
}`,
      },
      {
        language: "java",
        completeCode: `import java.util.Scanner;
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        HashSet<Integer> seen = new HashSet<>();
        boolean duplicate = false;
        for (int i = 0; i < n; i++) {
            int val = sc.nextInt();
            if (seen.contains(val)) {
                duplicate = true;
            }
            seen.add(val);
        }
        System.out.println(duplicate ? "true" : "false");
    }
}`,
      },
      {
        language: "python",
        completeCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:1+n]]
    if len(set(nums)) < len(nums):
        print("true")
    else:
        print("false")

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length === 0) return;
    const n = parseInt(tokens[0], 10);
    const nums = tokens.slice(1, 1 + n).map(x => parseInt(x, 10));
    const seen = new Set();
    for (const num of nums) {
        if (seen.has(num)) {
            console.log("true");
            return;
        }
        seen.add(num);
    }
    console.log("false");
}

main();`,
      },
    ],
  },

  // ==========================================
  // 4. MEDIUM - Two Sum II - Input Array Is Sorted (array)
  // ==========================================
  {
    title: "Two Sum II - Input Array Is Sorted",
    difficulty: "medium",
    tags: "array",
    description: `Given a 1-indexed array of integers \`numbers\` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific \`target\` number.

Return the indices of the two numbers, \`index1\` and \`index2\`, added by one as an integer array \`[index1, index2]\` of length 2.

The tests are generated such that there is exactly one solution. You may not use the same element twice. Your solution must use only constant extra space.

### Input Format
- First line contains two integers: \`n\` and \`target\`.
- Second line contains \`n\` space-separated sorted integers.

### Output Format
- Print the two 1-based indices separated by a space.

### Constraints
- \`2 <= n <= 3 * 10^4\`
- \`-1000 <= numbers[i] <= 1000\`
- \`numbers\` is sorted in non-decreasing order.
- \`-1000 <= target <= 1000\`
- Exactly one valid solution exists.`,
    visibleTestCases: [
      {
        input: "4 9\n2 7 11 15",
        output: "1 2",
        explanation: "The sum of 2 and 7 is 9. Therefore index1 = 1, index2 = 2.",
      },
      {
        input: "3 6\n2 3 4",
        output: "1 3",
        explanation: "The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3.",
      },
      {
        input: "2 -1\n-1 0",
        output: "1 2",
        explanation: "The sum of -1 and 0 is -1. Therefore index1 = 1, index2 = 2.",
      },
    ],
    hiddenTestCases: [
      {
        input: "5 100\n5 25 75 80 90",
        output: "2 3",
      },
      {
        input: "4 0\n-3 -2 2 4",
        output: "2 3",
      },
      {
        input: "6 14\n1 2 4 6 10 11",
        output: "3 5",
      },
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, target;
    if (!(cin >> n >> target)) return 0;
    vector<int> numbers(n);
    for (int i = 0; i < n; i++) cin >> numbers[i];

    // Write your solution here

    return 0;
}`,
      },
      {
        language: "java",
        initialCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();

        // Write your solution here
    }
}`,
      },
      {
        language: "python",
        initialCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    target = int(tokens[1])
    numbers = [int(x) for x in tokens[2:2+n]]

    # Write your solution here

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 2) return;
    const n = parseInt(tokens[0], 10);
    const target = parseInt(tokens[1], 10);
    const numbers = tokens.slice(2, 2 + n).map(x => parseInt(x, 10));

    // Write your solution here
}

main();`,
      },
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, target;
    if (!(cin >> n >> target)) return 0;
    vector<int> numbers(n);
    for (int i = 0; i < n; i++) cin >> numbers[i];

    int left = 0, right = n - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) {
            cout << (left + 1) << " " << (right + 1);
            return 0;
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return 0;
}`,
      },
      {
        language: "java",
        completeCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();

        int left = 0, right = n - 1;
        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) {
                System.out.println((left + 1) + " " + (right + 1));
                return;
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
}`,
      },
      {
        language: "python",
        completeCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    target = int(tokens[1])
    numbers = [int(x) for x in tokens[2:2+n]]

    left = 0
    right = n - 1
    while left < right:
        curr_sum = numbers[left] + numbers[right]
        if curr_sum == target:
            print(f"{left + 1} {right + 1}")
            return
        elif curr_sum < target:
            left += 1
        else:
            right -= 1

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 2) return;
    const n = parseInt(tokens[0], 10);
    const target = parseInt(tokens[1], 10);
    const numbers = tokens.slice(2, 2 + n).map(x => parseInt(x, 10));

    let left = 0, right = n - 1;
    while (left < right) {
        const sum = numbers[left] + numbers[right];
        if (sum === target) {
            console.log((left + 1) + " " + (right + 1));
            return;
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
}

main();`,
      },
    ],
  },

  // ==========================================
  // 5. MEDIUM - Longest Substring Without Repeating Characters (strings)
  // ==========================================
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    tags: "strings",
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.

### Input Format
- A single line containing the string \`s\`.

### Output Format
- Print an integer denoting the length of the longest non-repeating substring.

### Constraints
- \`0 <= s.length <= 5 * 10^4\`
- \`s\` consists of English letters, digits, symbols and spaces.`,
    visibleTestCases: [
      {
        input: "abcabcbb",
        output: "3",
        explanation: "The answer is 'abc', with the length of 3.",
      },
      {
        input: "bbbbb",
        output: "1",
        explanation: "The answer is 'b', with the length of 1.",
      },
      {
        input: "pwwkew",
        output: "3",
        explanation: "The answer is 'wke', with the length of 3.",
      },
    ],
    hiddenTestCases: [
      {
        input: "dvdf",
        output: "3",
      },
      {
        input: "aab",
        output: "2",
      },
      {
        input: "tmmzuxt",
        output: "5",
      },
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

int main() {
    string s;
    if (!(cin >> s)) {
        cout << 0;
        return 0;
    }

    // Write your solution here

    return 0;
}`,
      },
      {
        language: "java",
        initialCode: `import java.util.Scanner;
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) {
            System.out.println(0);
            return;
        }
        String s = sc.next();

        // Write your solution here
    }
}`,
      },
      {
        language: "python",
        initialCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    s = tokens[0] if tokens else ""

    # Write your solution here

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');

function main() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) {
        console.log(0);
        return;
    }
    const s = input.split(/\\s+/)[0];

    // Write your solution here
}

main();`,
      },
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    string s;
    if (!(cin >> s)) {
        cout << 0;
        return 0;
    }
    vector<int> lastIndex(256, -1);
    int maxLen = 0, start = 0;
    for (int i = 0; i < (int)s.length(); i++) {
        unsigned char ch = (unsigned char)s[i];
        if (lastIndex[ch] >= start) {
            start = lastIndex[ch] + 1;
        }
        lastIndex[ch] = i;
        maxLen = max(maxLen, i - start + 1);
    }
    cout << maxLen;
    return 0;
}`,
      },
      {
        language: "java",
        completeCode: `import java.util.Scanner;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) {
            System.out.println(0);
            return;
        }
        String s = sc.next();

        int[] lastIndex = new int[256];
        Arrays.fill(lastIndex, -1);
        int maxLen = 0, start = 0;
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if (lastIndex[ch] >= start) {
                start = lastIndex[ch] + 1;
            }
            lastIndex[ch] = i;
            maxLen = Math.max(maxLen, i - start + 1);
        }
        System.out.println(maxLen);
    }
}`,
      },
      {
        language: "python",
        completeCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        print(0)
        return
    s = tokens[0]

    last_index = {}
    max_len = 0
    start = 0
    for i, ch in enumerate(s):
        if ch in last_index and last_index[ch] >= start:
            start = last_index[ch] + 1
        last_index[ch] = i
        max_len = max(max_len, i - start + 1)
    print(max_len)

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');

function main() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) {
        console.log(0);
        return;
    }
    const s = input.split(/\\s+/)[0];
    const map = new Map();
    let maxLen = 0;
    let start = 0;

    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (map.has(ch) && map.get(ch) >= start) {
            start = map.get(ch) + 1;
        }
        map.set(ch, i);
        maxLen = Math.max(maxLen, i - start + 1);
    }
    console.log(maxLen);
}

main();`,
      },
    ],
  },

  // ==========================================
  // 6. MEDIUM - Container With Most Water (array)
  // ==========================================
  {
    title: "Container With Most Water",
    difficulty: "medium",
    tags: "array",
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store. Notice that you may not slant the container.

### Input Format
- First line contains integer \`n\` (length of array).
- Second line contains \`n\` space-separated integers.

### Output Format
- Print an integer denoting the maximum capacity.

### Constraints
- \`n == height.length\`
- \`2 <= n <= 10^5\`
- \`0 <= height[i] <= 10^4\``,
    visibleTestCases: [
      {
        input: "9\n1 8 6 2 5 4 8 3 7",
        output: "49",
        explanation: "The vertical lines are at indices 1 and 8, height min(8, 7) * distance (8 - 1) = 7 * 7 = 49.",
      },
      {
        input: "2\n1 1",
        output: "1",
        explanation: "1 * (1 - 0) = 1.",
      },
      {
        input: "5\n4 3 2 1 4",
        output: "16",
        explanation: "Lines at index 0 and 4 give min(4, 4) * 4 = 16.",
      },
    ],
    hiddenTestCases: [
      {
        input: "4\n1 2 4 3",
        output: "4",
      },
      {
        input: "6\n2 3 10 5 7 8",
        output: "24",
      },
      {
        input: "5\n1 2 1 2 1",
        output: "4",
      },
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> height(n);
    for (int i = 0; i < n; i++) cin >> height[i];

    // Write your solution here

    return 0;
}`,
      },
      {
        language: "java",
        initialCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] height = new int[n];
        for (int i = 0; i < n; i++) height[i] = sc.nextInt();

        // Write your solution here
    }
}`,
      },
      {
        language: "python",
        initialCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    height = [int(x) for x in tokens[1:1+n]]

    # Write your solution here

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length === 0) return;
    const n = parseInt(tokens[0], 10);
    const height = tokens.slice(1, 1 + n).map(x => parseInt(x, 10));

    // Write your solution here
}

main();`,
      },
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> height(n);
    for (int i = 0; i < n; i++) cin >> height[i];

    int left = 0, right = n - 1;
    long long maxWater = 0;
    while (left < right) {
        long long current = (long long)min(height[left], height[right]) * (right - left);
        maxWater = max(maxWater, current);
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    cout << maxWater;
    return 0;
}`,
      },
      {
        language: "java",
        completeCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] height = new int[n];
        for (int i = 0; i < n; i++) height[i] = sc.nextInt();

        int left = 0, right = n - 1;
        long maxWater = 0;
        while (left < right) {
            long current = (long)Math.min(height[left], height[right]) * (right - left);
            maxWater = Math.max(maxWater, current);
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        System.out.println(maxWater);
    }
}`,
      },
      {
        language: "python",
        completeCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    height = [int(x) for x in tokens[1:1+n]]

    left = 0
    right = n - 1
    max_water = 0
    while left < right:
        curr = min(height[left], height[right]) * (right - left)
        if curr > max_water:
            max_water = curr
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    print(max_water)

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length === 0) return;
    const n = parseInt(tokens[0], 10);
    const height = tokens.slice(1, 1 + n).map(x => parseInt(x, 10));

    let left = 0, right = n - 1;
    let maxWater = 0;
    while (left < right) {
        const current = Math.min(height[left], height[right]) * (right - left);
        if (current > maxWater) maxWater = current;
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    console.log(maxWater);
}

main();`,
      },
    ],
  },

  // ==========================================
  // 7. MEDIUM - Maximum Subarray (dp)
  // ==========================================
  {
    title: "Maximum Subarray",
    difficulty: "medium",
    tags: "dp",
    description: `Given an integer array \`nums\`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

A subarray is a contiguous part of an array.

### Input Format
- First line contains integer \`n\` (length of array).
- Second line contains \`n\` space-separated integers.

### Output Format
- Print the maximum subarray sum.

### Constraints
- \`1 <= n <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\``,
    visibleTestCases: [
      {
        input: "9\n-2 1 -3 4 -1 2 1 -5 4",
        output: "6",
        explanation: "The contiguous subarray [4, -1, 2, 1] has the largest sum = 6.",
      },
      {
        input: "1\n1",
        output: "1",
        explanation: "The subarray [1] has the largest sum = 1.",
      },
      {
        input: "5\n5 4 -1 7 8",
        output: "23",
        explanation: "The subarray [5, 4, -1, 7, 8] has the largest sum = 23.",
      },
    ],
    hiddenTestCases: [
      {
        input: "3\n-3 -2 -1",
        output: "-1",
      },
      {
        input: "4\n-10 -20 -30 -40",
        output: "-10",
      },
      {
        input: "6\n-2 3 -2 4 -1 5",
        output: "9",
      },
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // Write your solution here

    return 0;
}`,
      },
      {
        language: "java",
        initialCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();

        // Write your solution here
    }
}`,
      },
      {
        language: "python",
        initialCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:1+n]]

    # Write your solution here

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length === 0) return;
    const n = parseInt(tokens[0], 10);
    const nums = tokens.slice(1, 1 + n).map(x => parseInt(x, 10));

    // Write your solution here
}

main();`,
      },
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    long long currentSum = nums[0];
    long long maxSum = nums[0];
    for (int i = 1; i < n; i++) {
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    cout << maxSum;
    return 0;
}`,
      },
      {
        language: "java",
        completeCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        long[] nums = new long[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextLong();

        long currentSum = nums[0];
        long maxSum = nums[0];
        for (int i = 1; i < n; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }
        System.out.println(maxSum);
    }
}`,
      },
      {
        language: "python",
        completeCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:1+n]]

    current_sum = nums[0]
    max_sum = nums[0]
    for x in nums[1:]:
        current_sum = max(x, current_sum + x)
        max_sum = max(max_sum, current_sum)
    print(max_sum)

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length === 0) return;
    const n = parseInt(tokens[0], 10);
    const nums = tokens.slice(1, 1 + n).map(x => parseInt(x, 10));

    let currentSum = nums[0];
    let maxSum = nums[0];
    for (let i = 1; i < n; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    console.log(maxSum);
}

main();`,
      },
    ],
  },

  // ==========================================
  // 8. HARD - Trapping Rain Water (array)
  // ==========================================
  {
    title: "Trapping Rain Water",
    difficulty: "hard",
    tags: "array",
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.

### Input Format
- First line contains integer \`n\` (number of bars).
- Second line contains \`n\` space-separated integers representing the height elevation map.

### Output Format
- Print an integer denoting total units of trapped rain water.

### Constraints
- \`n == height.length\`
- \`1 <= n <= 2 * 10^4\`
- \`0 <= height[i] <= 10^5\``,
    visibleTestCases: [
      {
        input: "12\n0 1 0 2 1 0 1 3 2 1 2 1",
        output: "6",
        explanation: "The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are trapped.",
      },
      {
        input: "6\n4 2 0 3 2 5",
        output: "9",
        explanation: "9 units of water are trapped between index 0 and index 5.",
      },
      {
        input: "3\n3 0 3",
        output: "3",
        explanation: "3 units of water trapped in the middle.",
      },
    ],
    hiddenTestCases: [
      {
        input: "3\n1 2 3",
        output: "0",
      },
      {
        input: "5\n5 4 1 2 5",
        output: "8",
      },
      {
        input: "7\n0 2 0 3 1 0 2",
        output: "4",
      },
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> height(n);
    for (int i = 0; i < n; i++) cin >> height[i];

    // Write your solution here

    return 0;
}`,
      },
      {
        language: "java",
        initialCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] height = new int[n];
        for (int i = 0; i < n; i++) height[i] = sc.nextInt();

        // Write your solution here
    }
}`,
      },
      {
        language: "python",
        initialCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    height = [int(x) for x in tokens[1:1+n]]

    # Write your solution here

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length === 0) return;
    const n = parseInt(tokens[0], 10);
    const height = tokens.slice(1, 1 + n).map(x => parseInt(x, 10));

    // Write your solution here
}

main();`,
      },
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n) || n <= 2) {
        cout << 0;
        return 0;
    }
    vector<int> height(n);
    for (int i = 0; i < n; i++) cin >> height[i];

    int left = 0, right = n - 1;
    int leftMax = 0, rightMax = 0;
    long long totalWater = 0;

    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                totalWater += (leftMax - height[left]);
            }
            left++;
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                totalWater += (rightMax - height[right]);
            }
            right--;
        }
    }
    cout << totalWater;
    return 0;
}`,
      },
      {
        language: "java",
        completeCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) {
            System.out.println(0);
            return;
        }
        int n = sc.nextInt();
        int[] height = new int[n];
        for (int i = 0; i < n; i++) height[i] = sc.nextInt();

        int left = 0, right = n - 1;
        int leftMax = 0, rightMax = 0;
        long totalWater = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    totalWater += (leftMax - height[left]);
                }
                left++;
            } else {
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    totalWater += (rightMax - height[right]);
                }
                right--;
            }
        }
        System.out.println(totalWater);
    }
}`,
      },
      {
        language: "python",
        completeCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        print(0)
        return
    n = int(tokens[0])
    height = [int(x) for x in tokens[1:1+n]]

    left, right = 0, n - 1
    left_max, right_max = 0, 0
    total_water = 0

    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                total_water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                total_water += right_max - height[right]
            right -= 1
    print(total_water)

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length === 0) {
        console.log(0);
        return;
    }
    const n = parseInt(tokens[0], 10);
    const height = tokens.slice(1, 1 + n).map(x => parseInt(x, 10));

    let left = 0, right = n - 1;
    let leftMax = 0, rightMax = 0;
    let totalWater = 0;

    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                totalWater += leftMax - height[left];
            }
            left++;
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                totalWater += rightMax - height[right];
            }
            right--;
        }
    }
    console.log(totalWater);
}

main();`,
      },
    ],
  },

  // ==========================================
  // 9. HARD - Minimum Window Substring (strings)
  // ==========================================
  {
    title: "Minimum Window Substring",
    difficulty: "hard",
    tags: "strings",
    description: `Given two strings \`s\` and \`t\` of lengths \`m\` and \`n\` respectively, return the minimum window substring of \`s\` such that every character in \`t\` (including duplicates) is included in the window. If there is no such substring, return the empty string \`""\` (or output a blank line).

The testcases will be generated such that the answer is unique.

### Input Format
- First line contains string \`s\`.
- Second line contains string \`t\`.

### Output Format
- Print the minimum window substring.

### Constraints
- \`m == s.length\`, \`n == t.length\`
- \`1 <= m, n <= 10^5\`
- \`s\` and \`t\` consist of uppercase and lowercase English letters.`,
    visibleTestCases: [
      {
        input: "ADOBECODEBANC\nABC",
        output: "BANC",
        explanation: "The minimum window substring 'BANC' includes 'A', 'B', and 'C' from string t.",
      },
      {
        input: "a\na",
        output: "a",
        explanation: "The entire string s is the minimum window.",
      },
      {
        input: "aa\naa",
        output: "aa",
        explanation: "Both 'a's from t are included in the window 'aa'.",
      },
    ],
    hiddenTestCases: [
      {
        input: "ab\nb",
        output: "b",
      },
      {
        input: "bdab\nab",
        output: "ab",
      },
      {
        input: "cabwefgewcwaefgcf\ncae",
        output: "cwae",
      },
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    string s, t;
    if (!(cin >> s >> t)) return 0;

    // Write your solution here

    return 0;
}`,
      },
      {
        language: "java",
        initialCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s = sc.next();
        String t = sc.next();

        // Write your solution here
    }
}`,
      },
      {
        language: "python",
        initialCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if len(tokens) < 2:
        return
    s, t = tokens[0], tokens[1]

    # Write your solution here

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 2) return;
    const [s, t] = tokens;

    // Write your solution here
}

main();`,
      },
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    string s, t;
    if (!(cin >> s >> t)) return 0;
    if (s.empty() || t.empty() || s.length() < t.length()) {
        cout << "";
        return 0;
    }

    vector<int> target(128, 0);
    for (char c : t) target[(unsigned char)c]++;

    int required = 0;
    for (int count : target) {
        if (count > 0) required++;
    }

    vector<int> window(128, 0);
    int formed = 0;
    int minLen = 1e9, bestLeft = 0;
    int left = 0;

    for (int right = 0; right < (int)s.length(); right++) {
        char ch = s[right];
        window[(unsigned char)ch]++;
        if (target[(unsigned char)ch] > 0 && window[(unsigned char)ch] == target[(unsigned char)ch]) {
            formed++;
        }

        while (left <= right && formed == required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                bestLeft = left;
            }
            char leftChar = s[left];
            window[(unsigned char)leftChar]--;
            if (target[(unsigned char)leftChar] > 0 && window[(unsigned char)leftChar] < target[(unsigned char)leftChar]) {
                formed--;
            }
            left++;
        }
    }

    if (minLen > (int)s.length()) {
        cout << "";
    } else {
        cout << s.substr(bestLeft, minLen);
    }
    return 0;
}`,
      },
      {
        language: "java",
        completeCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) {
            System.out.println("");
            return;
        }
        String s = sc.next();
        String t = sc.next();

        if (s.length() < t.length()) {
            System.out.println("");
            return;
        }

        int[] target = new int[128];
        int required = 0;
        for (int i = 0; i < t.length(); i++) {
            if (target[t.charAt(i)] == 0) required++;
            target[t.charAt(i)]++;
        }

        int[] window = new int[128];
        int formed = 0;
        int minLen = Integer.MAX_VALUE;
        int bestLeft = 0;
        int left = 0;

        for (int right = 0; right < s.length(); right++) {
            char ch = s.charAt(right);
            window[ch]++;
            if (target[ch] > 0 && window[ch] == target[ch]) {
                formed++;
            }

            while (left <= right && formed == required) {
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    bestLeft = left;
                }
                char leftChar = s.charAt(left);
                window[leftChar]--;
                if (target[leftChar] > 0 && window[leftChar] < target[leftChar]) {
                    formed--;
                }
                left++;
            }
        }

        if (minLen > s.length()) {
            System.out.println("");
        } else {
            System.out.println(s.substring(bestLeft, bestLeft + minLen));
        }
    }
}`,
      },
      {
        language: "python",
        completeCode: `import sys
from collections import Counter

def main():
    tokens = sys.stdin.read().split()
    if len(tokens) < 2:
        print("")
        return
    s, t = tokens[0], tokens[1]
    if len(s) < len(t):
        print("")
        return

    target = Counter(t)
    required = len(target)
    window = {}
    formed = 0

    min_len = float("inf")
    best_left = 0
    left = 0

    for right, ch in enumerate(s):
        window[ch] = window.get(ch, 0) + 1
        if ch in target and window[ch] == target[ch]:
            formed += 1

        while left <= right and formed == required:
            if right - left + 1 < min_len:
                min_len = right - left + 1
                best_left = left

            left_char = s[left]
            window[left_char] -= 1
            if left_char in target and window[left_char] < target[left_char]:
                formed -= 1
            left += 1

    if min_len == float("inf"):
        print("")
    else:
        print(s[best_left:best_left + min_len])

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 2) {
        console.log("");
        return;
    }
    const [s, t] = tokens;
    if (s.length < t.length) {
        console.log("");
        return;
    }

    const target = new Map();
    for (const ch of t) {
        target.set(ch, (target.get(ch) || 0) + 1);
    }
    const required = target.size;

    const window = new Map();
    let formed = 0;
    let minLen = Infinity;
    let bestLeft = 0;
    let left = 0;

    for (let right = 0; right < s.length; right++) {
        const ch = s[right];
        window.set(ch, (window.get(ch) || 0) + 1);
        if (target.has(ch) && window.get(ch) === target.get(ch)) {
            formed++;
        }

        while (left <= right && formed === required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                bestLeft = left;
            }
            const leftChar = s[left];
            window.set(leftChar, window.get(leftChar) - 1);
            if (target.has(leftChar) && window.get(leftChar) < target.get(leftChar)) {
                formed--;
            }
            left++;
        }
    }

    if (minLen === Infinity) {
        console.log("");
    } else {
        console.log(s.slice(bestLeft, bestLeft + minLen));
    }
}

main();`,
      },
    ],
  },

  // ==========================================
  // 10. HARD - Longest Valid Parentheses (dp)
  // ==========================================
  {
    title: "Longest Valid Parentheses",
    difficulty: "hard",
    tags: "dp",
    description: `Given a string containing just the characters \`'('\` and \`')'\`, return the length of the longest valid (well-formed) parentheses substring.

### Input Format
- A single line containing string \`s\` made of \`'('\` and \`')'\`.

### Output Format
- Print an integer denoting the length of the longest valid parentheses substring.

### Constraints
- \`0 <= s.length <= 3 * 10^4\`
- \`s[i]\` is either \`'('\` or \`')'\`.`,
    visibleTestCases: [
      {
        input: "(()",
        output: "2",
        explanation: "The longest valid parentheses substring is '()'.",
      },
      {
        input: ")()())",
        output: "4",
        explanation: "The longest valid parentheses substring is '()()'.",
      },
      {
        input: "()(())",
        output: "6",
        explanation: "The entire string is valid.",
      },
    ],
    hiddenTestCases: [
      {
        input: ")",
        output: "0",
      },
      {
        input: "()(()",
        output: "2",
      },
      {
        input: "(()())",
        output: "6",
      },
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <iostream>
#include <string>
#include <vector>
#include <stack>
using namespace std;

int main() {
    string s;
    if (!(cin >> s)) {
        cout << 0;
        return 0;
    }

    // Write your solution here

    return 0;
}`,
      },
      {
        language: "java",
        initialCode: `import java.util.Scanner;
import java.util.Stack;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) {
            System.out.println(0);
            return;
        }
        String s = sc.next();

        // Write your solution here
    }
}`,
      },
      {
        language: "python",
        initialCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        print(0)
        return
    s = tokens[0]

    # Write your solution here

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');

function main() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) {
        console.log(0);
        return;
    }
    const s = input.split(/\\s+/)[0];

    // Write your solution here
}

main();`,
      },
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    string s;
    if (!(cin >> s)) {
        cout << 0;
        return 0;
    }
    int n = s.length();
    if (n < 2) {
        cout << 0;
        return 0;
    }
    vector<int> dp(n, 0);
    int maxLen = 0;
    for (int i = 1; i < n; i++) {
        if (s[i] == ')') {
            if (s[i - 1] == '(') {
                dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2;
            } else if (i - dp[i - 1] > 0 && s[i - dp[i - 1] - 1] == '(') {
                dp[i] = dp[i - 1] + 2 + ((i - dp[i - 1] >= 2) ? dp[i - dp[i - 1] - 2] : 0);
            }
            maxLen = max(maxLen, dp[i]);
        }
    }
    cout << maxLen;
    return 0;
}`,
      },
      {
        language: "java",
        completeCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) {
            System.out.println(0);
            return;
        }
        String s = sc.next();
        int n = s.length();
        if (n < 2) {
            System.out.println(0);
            return;
        }
        int[] dp = new int[n];
        int maxLen = 0;
        for (int i = 1; i < n; i++) {
            if (s.charAt(i) == ')') {
                if (s.charAt(i - 1) == '(') {
                    dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2;
                } else if (i - dp[i - 1] > 0 && s.charAt(i - dp[i - 1] - 1) == '(') {
                    dp[i] = dp[i - 1] + 2 + ((i - dp[i - 1] >= 2) ? dp[i - dp[i - 1] - 2] : 0);
                }
                maxLen = Math.max(maxLen, dp[i]);
            }
        }
        System.out.println(maxLen);
    }
}`,
      },
      {
        language: "python",
        completeCode: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        print(0)
        return
    s = tokens[0]
    n = len(s)
    if n < 2:
        print(0)
        return

    dp = [0] * n
    max_len = 0
    for i in range(1, n):
        if s[i] == ')':
            if s[i - 1] == '(':
                dp[i] = (dp[i - 2] if i >= 2 else 0) + 2
            elif i - dp[i - 1] > 0 and s[i - dp[i - 1] - 1] == '(':
                dp[i] = dp[i - 1] + 2 + (dp[i - dp[i - 1] - 2] if i - dp[i - 1] >= 2 else 0)
            if dp[i] > max_len:
                max_len = dp[i]
    print(max_len)

if __name__ == '__main__':
    main()`,
      },
      {
        language: "javascript",
        completeCode: `const fs = require('fs');

function main() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) {
        console.log(0);
        return;
    }
    const s = input.split(/\\s+/)[0];
    const n = s.length;
    if (n < 2) {
        console.log(0);
        return;
    }

    const dp = new Array(n).fill(0);
    let maxLen = 0;
    for (let i = 1; i < n; i++) {
        if (s[i] === ')') {
            if (s[i - 1] === '(') {
                dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2;
            } else if (i - dp[i - 1] > 0 && s[i - dp[i - 1] - 1] === '(') {
                dp[i] = dp[i - 1] + 2 + (i - dp[i - 1] >= 2 ? dp[i - dp[i - 1] - 2] : 0);
            }
            if (dp[i] > maxLen) maxLen = dp[i];
        }
    }
    console.log(maxLen);
}

main();`,
      },
    ],
  },
];
